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
      setLodging((prev) => ({ ...prev, region: "서울" }));
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
    <div style={bg}>
      <div ref={pageRef} style={container}>
        <Header />

        <Section title="기본 정보">
          <div style={centerGrid}>
            <Input label="이름" value={form.name}
              onChange={(v) => setForm({ ...form, name: v })} />

            <Input label="소속" value={form.department}
              onChange={(v) => setForm({ ...form, department: v })} />

            <Select value={form.position}
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

        <Section title="식비 / 회의비">
          <div style={centerGrid}>
            <SelectNumber label="식대 제공" value={mealProvided} setValue={setMealProvided} />
            <SelectNumber label="회의비 사용" value={meetingMeals} setValue={setMeetingMeals} />
          </div>
        </Section>

        <Section title="숙박비">
          <div style={centerGrid}>
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
              기준:{" "}
              {typeof lodgingLimit === "number"
                ? lodgingLimit.toLocaleString() + "원"
                : lodgingLimit}
            </div>

            <Input
              label="숙박비"
              type="number"
              value={lodging.amount}
              onChange={(v) =>
                setLodging({ ...lodging, amount: v })
              }
            />
          </div>
        </Section>

        <Section title="교통비">
          <Input label="교통비"
            type="number"
            value={transport}
            onChange={setTransport} />
        </Section>

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

/* ================= HEADER ================= */

function Header() {
  return (
    <div style={header}>
      출장비 신청서 자동 정산 시스템
    </div>
  );
}

/* ================= COMPONENT ================= */

function Section({ title, children }) {
  return (
    <div style={section}>
      <div style={sectionTitle}>{title}</div>
      <div style={sectionBox}>{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div style={field}>
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
    <div style={field}>
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
    <div style={field}>
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
      <div style={{ fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: "bold" }}>
        {Number(value).toLocaleString()}원
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const bg = {
  background: "#f1f5f9",
  minHeight: "100vh",
  padding: 20,
};

const container = {
  maxWidth: 900,
  margin: "0 auto",
  background: "white",
  padding: 28,
  borderRadius: 18,
};

const header = {
  background: "linear-gradient(135deg,#dbeafe,#eff6ff)",
  padding: 20,
  borderRadius: 14,
  marginBottom: 20,
  fontSize: 20,
  fontWeight: "bold",
  textAlign: "center",
};

const section = { marginTop: 22 };

const sectionTitle = {
  fontSize: 18,
  fontWeight: "800",
  color: "#1e3a8a",
  marginBottom: 10,
};

const sectionBox = {
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 18,
};

const centerGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
  justifyItems: "center",
};

const field = {
  width: "100%",
  maxWidth: 240,
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 12,
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 6,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
};

const labelStyle = {
  fontSize: 13,
  color: "#334155",
};

const infoBox = {
  padding: 10,
  borderRadius: 10,
  background: "#f1f5f9",
};

const btnWrap = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 20,
};

const btn = {
  padding: "10px 14px",
  borderRadius: 10,
  background: "#1d4ed8",
  color: "white",
  border: "none",
};