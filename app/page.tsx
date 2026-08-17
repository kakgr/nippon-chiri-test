"use client";

import { useEffect, useMemo, useState } from "react";

type Question = {
  id: number;
  category: string;
  level: "標準" | "高難度";
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
};

const questions: Question[] = [
  { id: 1, category: "地形", level: "標準", prompt: "日本で最も面積が大きい都道府県は？", choices: ["岩手県", "北海道", "長野県", "福島県"], answer: 1, explanation: "北海道は日本の国土の約5分の1を占める、面積最大の都道府県です。" },
  { id: 2, category: "交通", level: "標準", prompt: "東海道新幹線で、東京から最初に到着する政令指定都市は？", choices: ["横浜市", "静岡市", "名古屋市", "浜松市"], answer: 0, explanation: "東京駅の次は品川、新横浜。新横浜駅がある横浜市が最初です。" },
  { id: 3, category: "食文化", level: "標準", prompt: "讃岐うどんで知られる都道府県は？", choices: ["香川県", "徳島県", "愛媛県", "高知県"], answer: 0, explanation: "香川県は『うどん県』の愛称でも知られ、讃岐うどんが名物です。" },
  { id: 4, category: "観光", level: "標準", prompt: "日本三景に含まれないものは？", choices: ["松島", "天橋立", "宮島", "嵐山"], answer: 3, explanation: "日本三景は宮城県の松島、京都府の天橋立、広島県の宮島です。" },
  { id: 5, category: "気候", level: "標準", prompt: "冬に雪が多い日本海側と対照的に、太平洋側で乾燥した晴天が多い理由は？", choices: ["海流が暖かいから", "山地が季節風をさえぎるから", "台風が来ないから", "標高が低いから"], answer: 1, explanation: "冬の季節風は日本海側で雪を降らせ、山地を越えた太平洋側では乾いた風になります。" },
  { id: 6, category: "都道府県", level: "標準", prompt: "県名と県庁所在地の市名が同じ県は？", choices: ["栃木県―宇都宮市", "島根県―松江市", "高知県―高知市", "神奈川県―横浜市"], answer: 2, explanation: "高知県の県庁所在地は高知市。県名と市名が同じ組み合わせです。" },
  { id: 7, category: "都市", level: "標準", prompt: "『杜の都』と呼ばれる都市は？", choices: ["仙台市", "札幌市", "金沢市", "神戸市"], answer: 0, explanation: "仙台市は街路樹や青葉山など、豊かな緑から『杜の都』と呼ばれます。" },
  { id: 8, category: "海・島", level: "標準", prompt: "瀬戸内海に面していない県は？", choices: ["岡山県", "山口県", "佐賀県", "香川県"], answer: 2, explanation: "佐賀県は玄界灘・有明海に面しています。瀬戸内海に面するのは岡山・山口・香川などです。" },
  { id: 9, category: "産業", level: "標準", prompt: "自動車産業が特に盛んな都市として知られるのは？", choices: ["豊田市", "松本市", "高山市", "函館市"], answer: 0, explanation: "愛知県豊田市はトヨタ自動車の企業城下町として発展しました。" },
  { id: 10, category: "歴史地理", level: "標準", prompt: "古都として、奈良とともに修学旅行先でも定番の都市は？", choices: ["京都市", "前橋市", "宮崎市", "新潟市"], answer: 0, explanation: "京都は約1000年にわたり都が置かれ、寺社や町並みが残る古都です。" },
  { id: 11, category: "高難度", level: "高難度", prompt: "日本で最も長い川は？", choices: ["利根川", "信濃川", "石狩川", "北上川"], answer: 1, explanation: "信濃川は長野県内では千曲川と呼ばれ、全長367kmで日本最長です。" },
  { id: 12, category: "高難度", level: "高難度", prompt: "日本の政令指定都市で、海に面していない都市は？", choices: ["さいたま市", "福岡市", "新潟市", "神戸市"], answer: 0, explanation: "さいたま市は内陸に位置する政令指定都市です。" },
  { id: 13, category: "高難度", level: "高難度", prompt: "中央構造線が通ることで知られる県は？", choices: ["長野県", "秋田県", "沖縄県", "鳥取県"], answer: 0, explanation: "中央構造線は長野県から紀伊半島、四国などを通る大断層です。" },
  { id: 14, category: "高難度", level: "高難度", prompt: "日本で唯一、県庁所在地が県内最大都市ではない県は？（2020年代）", choices: ["群馬県", "静岡県", "三重県", "滋賀県"], answer: 1, explanation: "静岡県は県庁所在地が静岡市、県内最大の人口規模は浜松市です。" },
  { id: 15, category: "高難度", level: "高難度", prompt: "『北の玄関口』として発展した港町は？", choices: ["小樽市", "下関市", "長崎市", "尾道市"], answer: 0, explanation: "小樽は北海道開拓の時代から、北海道の海の玄関口として栄えました。" },
  { id: 16, category: "高難度", level: "高難度", prompt: "日本で最も大きい湖は？", choices: ["霞ヶ浦", "浜名湖", "琵琶湖", "サロマ湖"], answer: 2, explanation: "滋賀県の琵琶湖は面積約670km²。日本最大の湖です。" },
  { id: 17, category: "高難度", level: "高難度", prompt: "四国4県のうち、瀬戸内海に面していない県は？", choices: ["香川県", "徳島県", "愛媛県", "高知県"], answer: 3, explanation: "高知県は太平洋に面し、瀬戸内海には面していません。" },
  { id: 18, category: "高難度", level: "高難度", prompt: "日本の標準時子午線（東経135度）が通る市は？", choices: ["明石市", "姫路市", "神戸市", "西宮市"], answer: 0, explanation: "兵庫県明石市を通る東経135度が、日本の標準時の基準です。" },
  { id: 19, category: "高難度", level: "高難度", prompt: "世界自然遺産『屋久島』が属する県は？", choices: ["鹿児島県", "宮崎県", "熊本県", "沖縄県"], answer: 0, explanation: "屋久島は鹿児島県に属し、樹齢数千年ともいわれる屋久杉で知られます。" },
  { id: 20, category: "高難度", level: "高難度", prompt: "本州と北海道の間にある海峡は？", choices: ["関門海峡", "津軽海峡", "鳴門海峡", "豊予海峡"], answer: 1, explanation: "津軽海峡は本州北端の青森県と北海道の間にあります。" },
];

const STORAGE_KEY = "nippon-chiri-history";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<{ score: number; date: string }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const score = useMemo(() => answers.reduce((sum, value, index) => sum + (value === questions[index]?.answer ? 1 : 0), 0), [answers]);
  const shareText = `日本地理テストで ${score} / ${questions.length} 問正解しました！ #ニッポン地理テスト`;

  const start = () => { setStarted(true); setFinished(false); setCurrent(0); setAnswers([]); setSelected(null); };
  const choose = (index: number) => { if (selected === null) setSelected(index); };
  const next = () => {
    if (selected === null) return;
    const nextAnswers = [...answers]; nextAnswers[current] = selected; setAnswers(nextAnswers); setSelected(null);
    if (current === questions.length - 1) {
      setFinished(true);
      const nextHistory = [{ score: nextAnswers.reduce((sum, value, index) => sum + (value === questions[index].answer ? 1 : 0), 0), date: new Date().toLocaleDateString("ja-JP") }, ...history].slice(0, 5);
      setHistory(nextHistory); localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
    } else setCurrent(current + 1);
  };
  const share = (type: "line" | "discord" | "copy") => {
    if (type === "line") window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`, "_blank");
    else if (type === "discord") navigator.clipboard?.writeText(shareText + "\n" + window.location.href);
    else navigator.clipboard?.writeText(shareText + "\n" + window.location.href);
  };

  if (!started) return <main className="landing"><div className="topbar"><div className="brand"><span className="brand-mark">〽</span><span>ニッポン地理テスト</span></div><span className="edition">一般教養 / 旅する知識</span></div><section className="hero"><div className="hero-copy"><p className="eyebrow">KNOW JAPAN, BETTER</p><h1>知っているようで<br /><em>知らない。</em>日本のこと。</h1><p className="lead">旅行先で役立つ地理から、思わず誰かに話したくなる豆知識まで。日本をもっと好きになる20問。</p><button className="primary" onClick={start}>テストをはじめる <span>→</span></button><p className="microcopy">全20問 ・ 約5分 ・ 何度でも挑戦OK</p></div><div className="hero-art"><div className="sun" /><div className="mountain mountain-back" /><div className="mountain mountain-front" /><div className="map-dot dot-a" /><div className="map-dot dot-b" /><div className="map-dot dot-c" /><div className="vertical-label">47 PREFECTURES</div></div></section><section className="feature-row"><div><span className="feature-icon">◉</span><strong>旅と暮らしに役立つ</strong><p>会話のきっかけになる、リアルな日本地理。</p></div><div><span className="feature-icon">✦</span><strong>後半は高難度</strong><p>知識自慢も唸る、ちょっと手ごわい問題。</p></div><div><span className="feature-icon">↗</span><strong>結果をシェア</strong><p>LINEやDiscordで、友だちとスコア勝負。</p></div></section>{history.length > 0 && <div className="history-preview">前回のスコア <b>{history[0].score} / 20</b>　<span>{history[0].date}</span></div>}</main>;

  if (finished) return <main className="result-page"><div className="topbar"><div className="brand"><span className="brand-mark">〽</span><span>ニッポン地理テスト</span></div><button className="back-button" onClick={() => setStarted(false)}>トップへ戻る</button></div><section className="result-card"><p className="eyebrow">YOUR RESULT</p><h1>おつかれさまでした！</h1><div className="score-ring"><span>{score}</span><small>/ {questions.length} 問正解</small></div><p className="result-message">{score >= 17 ? "すごい！日本地理マスターです。" : score >= 12 ? "いい調子！旅の引き出しが増えました。" : "ここから伸びしろたっぷり。もう一度挑戦！"}</p><div className="share-box"><span>結果をシェアする</span><div className="share-buttons"><button className="line" onClick={() => share("line")}>LINEで送る</button><button className="discord" onClick={() => share("discord")}>Discordにコピー</button><button className="copy" onClick={() => share("copy")}>リンクをコピー</button></div></div><button className="primary retry" onClick={start}>もう一度挑戦する <span>↻</span></button></section></main>;

  const question = questions[current];
  return <main className="quiz-page"><div className="quiz-top"><div className="brand"><span className="brand-mark">〽</span><span>ニッポン地理テスト</span></div><span className="progress-label">{String(current + 1).padStart(2, "0")} <i>/ 20</i></span></div><div className="progress"><span style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div><section className="quiz-shell"><div className="question-meta"><span className="category">{question.category}</span><span className={question.level === "高難度" ? "level hard" : "level"}>{question.level}</span></div><h1>{question.prompt}</h1><p className="question-note">正しいと思うものをひとつ選んでください。</p><div className="choices">{question.choices.map((choice, index) => <button key={choice} className={`choice ${selected === index ? "selected" : ""}`} onClick={() => choose(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}<b>{selected === index ? "✓" : ""}</b></button>)}</div><div className="quiz-footer"><span>{selected === null ? "選択すると次へ進めます" : "回答を選択しました"}</span><button className="next-button" disabled={selected === null} onClick={next}>{current === questions.length - 1 ? "結果を見る" : "次の問題"} <span>→</span></button></div></section></main>;
}
