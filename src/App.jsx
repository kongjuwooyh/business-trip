import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const pageRef = useRef();

  const [form, setForm] = useState({
    name: "",
    department: "",
    position: "조교수/연구원/학생",
    startDate: "",
    endDate: "",
    destination: "",
  });

  const [mealProvided, setMealProvided] = useState(0);
  const [meetingMeals, setMeetingMeals] = useState(0);

  const [lodging, setLodging] = useState({
    region: "서울",
    amount: 0,
  });

  const [transport, setTransport] = useState(0);

  const mealUnit = 25000;
  const dailyAllowance = 20000;

  const isProfessor = form.position === "교수/부교수";

  const lodgingLimit = isProfessor
    ? "실비 지급"
    : lodging.region === "서울"
    ? 100000
    : lodging.region === "광역시"
    ? 80000
    : 70000;

  const mealAmount =
    Math.max(0, 3 - mealProvided - meetingMeals) * mealUnit;

  const total =
    mealAmount +
    dailyAllowance +
    Number(lodging.amount) +
    Number(transport);

  useEffect(() => {
    if (isProfessor) {
      setLodging((prev) => ({
        ...prev,
        region: "서울",
      }));
    }
  }, [isProfessor]);

  const saveImage = async () => {
    const canvas = await html2canvas(pageRef.current);
    const link = document.createElement("a");
    link.download = "출장비신청서.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const savePDF = async () => {
    const canvas = await html2canvas(pageRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("출장비신청서.pdf");
  };

  return (
    <div style={page}>
      <div ref={pageRef} style={container}>

        <Header />

        {/* 기본정보 */}
        <Section title="기본 정보">
          <div style={grid2}>
            <Input label="이름" value={form.name}
              onChange={(v) => setForm({ ...form, name: v })} />

            <Input label="소속" value={form.department}
              onChange={(v) => setForm({ ...form, department: v })} />

            <Select label="직급"
              value={form.position}
              onChange={(v) => setForm({ ...form, position: v })} />

            <Input label="출장지" value={form.destination}
              onChange={(v) => setForm({ ...form, destination: v })} />

            <Input label="시작일" type="date"
              value={form.startDate}
              onChange={(v) => setForm({ ...form, startDate: v })} />

            <Input label="종료일" type="date"
              value={form.endDate}
              onChange={(v) => setForm({ ...form, endDate: v })} />
          </div>
        </Section>

        {/* 식비 */}
        <Section title="식비 / 회의비">
          <div style={grid2}>
            <SelectNumber label="식대 제공" value={mealProvided} setValue={setMealProvided} />
            <SelectNumber label="회의비 사용" value={meetingMeals} setValue={setMeetingMeals} />
          </div>
        </Section>

        {/* 숙박 */}
        <Section title="숙박비">
          <div style={grid2}>
            <select
              style={input}
              disabled={isProfessor}
              value={lodging.region}
              onChange={(e) =>
                setLodging({ ...lodging, region: e.target.value })
              }
            >
              <option>서울</option>
              <option>광역시</option>
              <option>기타</option>
            </select>

            <div style={infoBox}>
              기준: {typeof lodgingLimit === "number"
                ? lodgingLimit.toLocaleString() + "원"
                : lodgingLimit}
            </div>

            <Input label="숙박비" type="number"
              value={lodging.amount}
              onChange={(v) =>
                setLodging({ ...lodging, amount: v })
              } />
          </div>
        </Section>

        {/* 교통 */}
        <Section title="교통비">
          <Input label="교통비"
            type="number"
            value={transport}
            onChange={setTransport} />
        </Section>

        {/* 정산요약 */}
        <Section title="정산 요약">
          <div style={summaryGrid}>
            <Card title="식비" value={mealAmount} />
            <Card title="일비" value={dailyAllowance} />
            <Card title="숙박" value={lodging.amount} />
            <Card title="교통" value={transport} />
            <Card title="총액" value={total} highlight />
          </div>
        </Section>

        <div style={btnWrap}>
          <button style={btn} onClick={saveImage}>이미지 저장</button>
          <button style={btn} onClick={savePDF}>PDF 저장</button>
        </div>

      </div>
    </div>
  );
}

/* ================= UI COMPONENT ================= */

function Header() {
  return (
    <div style={{ marginBottom: 25 }}>
      <h1 style={{ margin: 0, fontSize: 26 }}>출장비 신청서</h1>
      <p style={{ marginTop: 6, color: "#64748b" }}>
        자동 계산 정산 시스템
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={section}>
      <h2 style={sectionTitle}>{title}</h2>
      <div style={box}>{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={input}
      />
    </div>
  );
}

function Select({ value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>직급</label>
      <select
        style={input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option>교수/부교수</option>
        <option>조교수/연구원/학생</option>
      </select>
    </div>
  );
}

function SelectNumber({ value, setValue, label }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      <select
        style={input}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      >
        <option value={0}>0</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>
    </div>
  );
}

function Card({ title, value, highlight }) {
  return (
    <div style={{
      padding: 16,
      borderRadius: 14,
      background: highlight ? "#dbeafe" : "#f8fafc",
      border: "1px solid #e5e7eb"
    }}>
      <div style={{ fontSize: 13, color: "#64748b" }}>
        {title}
      </div>
      <div style={{
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 6
      }}>
        {Number(value).toLocaleString()}원
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const page = {
  background: "#f3f4f6",
  minHeight: "100vh",
  padding: 30,
};

const container = {
  maxWidth: 900,
  margin: "0 auto",
  background: "white",
  padding: 30,
  borderRadius: 18,
};

const section = {
  marginTop: 26,
};

const sectionTitle = {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
};

const box = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 18,
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 16,
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: 12,
};

const input = {
  width: "100%",
  padding: 10,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  marginTop: 6,
};

const labelStyle = {
  fontSize: 13,
  color: "#374151",
};

const infoBox = {
  padding: 10,
  background: "#f8fafc",
  borderRadius: 10,
};

const btnWrap = {
  marginTop: 30,
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const btn = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};