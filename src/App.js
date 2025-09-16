import React, { useState, useEffect } from "react";
import "./App.css";

// 한글 초성 추출
const getChoseong = (text) => {
  const CHOSEONG_LIST = [
    "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ",
    "ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ",
    "ㅋ","ㅌ","ㅍ","ㅎ"
  ];
  return text
    .split("")
    .map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0xac00 && code <= 0xd7a3) {
        const idx = code - 0xac00;
        return CHOSEONG_LIST[Math.floor(idx / 588)];
      }
      return c;
    })
    .join("");
};

// 한글 + 띄어쓰기만
const onlyHangulWithSpace = (text) => text.replace(/[^가-힣\s]/g, "");

// 힌트 추가
const addHint = (word, currentHint) => {
  const candidates = [];
  for (let i = 0; i < word.length; i++) {
    const code = word[i].charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3 && currentHint[i] === "□") {
      candidates.push(i);
    }
  }
  if (candidates.length === 0) return currentHint;
  const randIndex = candidates[Math.floor(Math.random() * candidates.length)];
  return word
    .split("")
    .map((c, i) => {
      if (i === randIndex) return getChoseong(c);
      if (c === " ") return "⁀";
      if (currentHint[i] !== "□") return currentHint[i];
      return "□";
    })
    .join("");
};

function App() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("start");
  const [current, setCurrent] = useState(null);
  const [hint, setHint] = useState("");
  const [hintFlash, setHintFlash] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [scoreCounted, setScoreCounted] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [savedProblems, setSavedProblems] = useState([]);

  const [selectedUnits, setSelectedUnits] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPOS, setSelectedPOS] = useState([]);

  const [unitOptions, setUnitOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [posOptions, setPosOptions] = useState([]);

  const [showFilter, setShowFilter] = useState(false);

  // JSON fetch
  useEffect(() => {
    async function fetchRandomWord() {
      try {
        // 1️⃣ JSON 파일 리스트 가져오기
        const resFiles = await fetch(process.env.PUBLIC_URL + "/words_jsons/file_list.json");
        const files = await resFiles.json(); // file_list.json 안에 ["file1.json","file2.json", ...] 형태로 저장돼 있어야 함

        if (!files || files.length === 0) {
          console.error("words_jsons 폴더에 JSON 파일이 없습니다!");
          setLoading(false);
          return;
        }

        // 2️⃣ 랜덤 파일 선택
        const randomFile = files[Math.floor(Math.random() * files.length)];

        // 3️⃣ 선택한 JSON 파일에서 데이터 가져오기
        const resData = await fetch(process.env.PUBLIC_URL + `/words_jsons/${randomFile}`);
        const jsonData = await resData.json();

        setWords(jsonData);

        // 옵션 설정 (기존 코드 유지)
        const normalize = (v) => v ? v : "미분류";
        const units = Array.from(new Set(jsonData.map(w => normalize(w["구성 단위"]))));
        const types = Array.from(new Set(jsonData.map(w => normalize(w["고유어 여부"]))));
        const pos = Array.from(new Set(jsonData.map(w => normalize(w["품사"]))));

        setUnitOptions(units);
        setTypeOptions(types);
        setPosOptions(pos);

        setSelectedUnits(units);
        setSelectedTypes(types);
        setSelectedPOS(pos);

        const storedSaved = localStorage.getItem("savedProblems");
        if (storedSaved) setSavedProblems(JSON.parse(storedSaved));
      } catch (err) {
        console.error("JSON 로드 실패!!!", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRandomWord();
  }, []);

  const toggleSelection = (value, selectedList, setSelectedList) => {
    if (selectedList.includes(value)) setSelectedList(selectedList.filter(v => v !== value));
    else setSelectedList([...selectedList, value]);
  };

  const saveProblemHandler = () => {
    if (!current) return;
    if (!savedProblems.find(p => p.어휘 === current.어휘)) {
      const newSaved = [...savedProblems, current];
      setSavedProblems(newSaved);
      localStorage.setItem("savedProblems", JSON.stringify(newSaved));
      alert("문제가 저장되었습니다!");
    } else {
      alert("이미 저장된 문제입니다!");
    }
  };

  const generateProblemFromPool = (pool) => {
    if (!words || words.length === 0) {
      alert("문제 데이터 로딩 중입니다! 잠시만 기다려주세요!");
      return;
    }
    if (pool.length === 0) {
      setCurrent(null);
      setResultMessage(mode === "review" ? "저장한 문제가 없습니다!" : "문제가 없습니다!");
      return;
    }
    const selected = pool[Math.floor(Math.random() * pool.length)];
    const cleanWord = onlyHangulWithSpace(selected.어휘);
    const initialHint = cleanWord.split("").map(c => c === " " ? "⁀" : "□").join("");

    setCurrent({ ...selected, 어휘: cleanWord });
    setHint(initialHint);
    setUserAnswer("");
    setShowAnswer(false);
    setAnswerRevealed(false);
    setScoreCounted(false);
    setResultMessage("");
  };

  const generateProblem = (pool) => generateProblemFromPool(pool);
  const addHintHandler = () => {
    if (current) {
      setHint(addHint(current.어휘, hint));
      setHintFlash(true);
      setTimeout(() => setHintFlash(false), 300);
    }
  };
  const checkAnswer = () => {
    if (!current) return;
    setShowAnswer(true);
    if (!scoreCounted) {
      if (userAnswer === current.어휘) {
        setResultMessage("정답!!! 🎉");
        setScore({ correct: score.correct + 1, total: score.total + 1 });
        setScoreCounted(true);
      } else {
        setResultMessage("틀렸습니다 😢");
        setScore({ correct: score.correct, total: score.total + 1 });
      }
    }
  };
  const revealAnswer = () => setAnswerRevealed(true);
  const savedCount = savedProblems.length;

  const filteredWords = words.filter(w => {
    const unit = w["구성 단위"] ? w["구성 단위"] : "미분류";
    const type = w["고유어 여부"] ? w["고유어 여부"] : "미분류";
    const pos = w["품사"] ? w["품사"] : "미분류";
    const unitMatch = selectedUnits.length === 0 || selectedUnits.includes(unit);
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(type);
    const posMatch = selectedPOS.length === 0 || selectedPOS.includes(pos);
    return unitMatch && typeMatch && posMatch;
  });

  const HomeButton = (
    <div style={{ textAlign: "right", marginBottom: "10px" }}>
      <button className="btn-home" onClick={() => setMode("start")}>🏠 홈으로 가기</button>
    </div>
  );

  if (mode === "start") {
    return (
      <div className="app-container">
        <h1>우리말 겨루기 📝</h1>
        <img src={process.env.PUBLIC_URL + "/king.jpeg"} alt="홈 이미지" style={{ width: "300px", borderRadius: "15px", marginBottom: "20px" }} />
        <div style={{ marginBottom: "15px" }}>
          <button className="btn-play" disabled={loading} onClick={() => { setMode("play"); generateProblem(filteredWords); }}>
            문제풀기 {loading && "(로딩 중...)"}
          </button>
          <button className="btn-review" disabled={loading} onClick={() => { setMode("review"); generateProblem(savedProblems); }}>
            복습하기 {loading && "(로딩 중...)"}
          </button>
        </div>
        {/* 🔥 필터 토글 버튼 */}
        <div style={{ marginBottom: "20px" }}>
          <button 
            className="btn-secondary" 
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? "필터 닫기" : "필터 열기"}
          </button>
        </div>
        {showFilter && (
          <div className="filter-panel">
            <div>
              <strong>구성 단위:</strong>
              <button className="btn-secondary" onClick={() => setSelectedUnits([...unitOptions])}>전체 선택</button>
              <button className="btn-secondary" onClick={() => setSelectedUnits([])}>전체 해제</button>
              {unitOptions.map(u => (
                <label key={u} className="checkbox-label">
                  <input type="checkbox" checked={selectedUnits.includes(u)} onChange={() => toggleSelection(u, selectedUnits, setSelectedUnits)} /> {u}
                </label>
              ))}
            </div>
            <div style={{ marginTop: "10px" }}>
              <strong>고유어 여부:</strong>
              <button className="btn-secondary" onClick={() => setSelectedTypes([...typeOptions])}>전체 선택</button>
              <button className="btn-secondary" onClick={() => setSelectedTypes([])}>전체 해제</button>
              {typeOptions.map(t => (
                <label key={t} className="checkbox-label">
                  <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggleSelection(t, selectedTypes, setSelectedTypes)} /> {t}
                </label>
              ))}
            </div>
            <div style={{ marginTop: "10px" }}>
              <strong>품사:</strong>
              <button className="btn-secondary" onClick={() => setSelectedPOS([...posOptions])}>전체 선택</button>
              <button className="btn-secondary" onClick={() => setSelectedPOS([])}>전체 해제</button>
              {posOptions.map(p => (
                <label key={p} className="checkbox-label">
                  <input type="checkbox" checked={selectedPOS.includes(p)} onChange={() => toggleSelection(p, selectedPOS, setSelectedPOS)} /> {p}
                </label>
              ))}
            </div>
          </div>
        )}

        <p>저장 문제: {savedCount}개</p>
      </div>
    );
  }

  // 문제풀기 / 복습 화면
  return (
    <div className="app-container">
      {HomeButton}
      {current ? (
        <div className="play-panel">
          <p><strong>문제:</strong> {current.뜻풀이}</p>
          <p className={`hint-text ${hintFlash ? "flash" : ""}`}><strong>힌트:</strong> {hint}</p>
          <button className="btn-hint" onClick={addHintHandler}>🔎힌트 추가</button>
          <div className="answer-panel">
            <input value={userAnswer} onChange={e => setUserAnswer(e.target.value)} placeholder="정답 입력" />
            <button className="btn-primary" onClick={checkAnswer}>확인</button>
          </div>
          {showAnswer && (
            <div className="result-text">
              {userAnswer === current.어휘 ? resultMessage : (
                <>
                  {resultMessage} <button className="btn-primary-small" onClick={revealAnswer}>[정답 확인]</button>
                  {answerRevealed && <span> 정답: {current.어휘}</span>}
                </>
              )}
            </div>
          )}
          <div style={{ marginTop: "15px" }}>
            <button className="btn-play" onClick={() => generateProblem(mode === "review" ? savedProblems : filteredWords)}>🔨다음 문제</button>
            {mode === "play" && <button className="btn-save" onClick={saveProblemHandler}>💾문제 저장</button>}
            {mode === "review" && <button className="btn-delete" onClick={() => {
              const newSaved = savedProblems.filter(p => p.어휘 !== current.어휘);
              setSavedProblems(newSaved);
              localStorage.setItem("savedProblems", JSON.stringify(newSaved));
              generateProblem(newSaved);
            }}>🗑️ 문제 삭제</button>}
          </div>
          {mode === "review" && <p>저장 문제 전체: {savedCount}개</p>}
        </div>
      ) : (
        <p>{mode === "review" ? "저장한 문제가 없습니다!" : "문제가 없습니다!"}</p>
      )}

      <p className="score-board">점수: {score.correct}/{score.total}</p>
    </div>
  );
}

export default App;
