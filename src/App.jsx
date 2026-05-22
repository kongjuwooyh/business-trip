import React, { useState, useRef } from "react";
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
    type: "국내",
  });

  const [lodging, setLodging] = useState({
    amount: 0,
  });

  const [transport, setTransport] = useState({
    type: "자동차",
    toll: 0,
    parking: 0,
    fuel: "휘발유",
    train: 0,
    bus: 0,
    etc: 0,
    air: 0,
    airParking: 0,
  });

  const mealUnit = 25000;
  const dailyUnit = 25000;

  const days =
    form.startDate && form.endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(form.endDate) - new Date(form.startDate)) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  const meal = days * mealUnit;
  const daily = days * dailyUnit;

  const transportTotal =
    form.type === "해외"
      ? Number(transport.air) + Number(transport.airParking)
      : transport.type === "자동차"
      ? Number(transport.toll) + Number(transport.parking)
      : transport.type === "기차"
      ? Number(transport.train)
      : transport.type === "버스"
      ? Number(transport.bus)
      : Number(transport.etc);

  const total =
    meal + daily + Number(lodging.amount) + transportTotal;

  const saveImage = async () => {
    const canvas = await html2canvas(pageRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = "출장비신청서.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const savePDF = async () => {
    const canvas = await html2canvas(pageRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save("출장비신청서.pdf");
  };

  return (
    <div style={bg}>
      <div ref={pageRef} style={container}>
        <Header />

        {/* 기본정보 */}
        <Section title="기본 정보">
          <div style={grid}>
            <Input label="이름" />
            <Input label="소속" />
            <Select label="출장구분" options={["국내", "해외"]} />
            <Select label="직급" options={["교수/부교수", "조교수/연구원/학생"]} />
            <Input label="출장지" />
            <Input label="시작일" type="date" />
            <Input label="종료일" type="date" />
          </div>
        </Section>

        {/* 식비 */}
        <Section title="식비 / 일비">
          <div style={grid}>
            <div>출장일수: {days}일</div>
            <div>식비: {meal.toLocaleString()}원</div>
            <div>일비: {daily.toLocaleString()}원</div>
          </div>
        </Section>

        {/* 숙박 */}
        <Section title="숙박비">
          <div style={grid}>
            <Input label="숙박비" type="number" />
          </div>
        </Section>

        {/* 교통 */}
        <Section title="교통비">

          <div style={grid2}>
            <Select label="교통수단"
              options={["자동차", "기차", "버스", "항공", "기타"]} />

            {form.type === "국내" && (
              <>
                {transport.type === "자동차" && (
                  <>
                    <Input label="톨게이트" />
                    <Input label="주차비" />
                    <Select label="유종"
                      options={["휘발유", "경유", "LPG", "전기차", "하이브리드"]} />
                  </>
                )}

                {transport.type === "기차" && <Input label="기차비" />}
                {transport.type === "버스" && <Input label="버스비" />}
                {transport.type === "기타" && <Input label="기타 교통비" />}
              </>
            )}

            {form.type === "해외" && (
              <>
                <Input label="항공비" />
                <Input label="항공 주차비" />
              </>
            )}
          </div>
        </Section>

        {/* 정산 */}
        <Section title="정산 요약">
          <div style={summary}>
            <Card title="식비" />
            <Card title="일비" />
            <Card title="숙박" />
            <Card title="교통" />
            <Card title="총액" highlight />
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

/* ================= UI ================= */

function Header() {
  return <div style={header}>출장비 자동 정산 시스템</div>;
}

function Section({ title, children }) {
  return (
    <div style={section}>
      <h3 style={titleStyle}>{title}</h3>
      <div style={box}>{children}</div>
    </div>
  );
}

function Input({ label, type = "text" }) {
  return (
    <div style={field}>
      <label>{label}</label>
      <input type={type} style={input} />
    </div>
  );
}

function Select({ label, options }) {
  return (
    <div style={field}>
      <label>{label}</label>
      <select style={input}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Card({ title, highlight }) {
  return (
    <div style={{
      padding: 12,
      borderRadius: 10,
      background: highlight ? "#dbeafe" : "#f8fafc"
    }}>
      {title}
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
  background: "#fff",
  padding: 20,
  borderRadius: 12,
};

const header = {
  textAlign: "center",
  fontSize: 22,
  fontWeight: "bold",
  marginBottom: 20,
};

const section = { marginTop: 20 };

const titleStyle = {
  fontSize: 18,
  fontWeight: "bold",
  color: "#1e3a8a",
};

const box = {
  padding: 12,
  border: "1px solid #ddd",
  borderRadius: 10,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  justifyItems: "center",
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const summary = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: 10,
};

const field = {
  width: "100%",
  maxWidth: 200,
};

const input = {
  width: "100%",
  padding: 8,
};

const btnWrap = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 20,
};

const btn = {
  padding: 10,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
};