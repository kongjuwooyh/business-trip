import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const ref = useRef();

  const [form, setForm] = useState({
    name: "",
    dept: "",
    position: "조교수/연구원/학생",
    type: "국내",
    transport: "자동차",
    start: "",
    end: "",
  });

  const [cost, setCost] = useState({
    lodging: 0,
    toll: 0,
    parking: 0,
    fuel: "휘발유",
    train: 0,
    bus: 0,
    etc: 0,
    air: 0,
    airParking: 0,
  });

  /* ================= 출장일수 ================= */
  const days =
    form.start && form.end
      ? Math.max(
          1,
          Math.ceil(
            (new Date(form.end) -
              new Date(form.start)) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  const isOneDay = days === 1;

  /* ================= 식비 / 일비 ================= */
  const meal = days * 25000;
  const daily = days * 25000;

  /* ================= 숙박 기준 (핵심 수정) ================= */
  const isProfessor =
    form.position === "교수/부교수";

  const lodgingRule = isProfessor
    ? "실비 지급"
    : {
        서울: 100000,
        광역시: 80000,
        기타: 70000,
      };

  const lodgingLimit =
    isProfessor
      ? "실비 지급"
      : lodgingRule["서울"]; // 기본 표시용

  const lodgingValue = isOneDay
    ? 0
    : Number(cost.lodging || 0);

  /* ================= 교통비 ================= */
  const transportTotal = (() => {
    if (form.type === "해외") {
      return (
        Number(cost.air || 0) +
        Number(cost.airParking || 0)
      );
    }

    switch (form.transport) {
      case "자동차":
        return (
          Number(cost.toll || 0) +
          Number(cost.parking || 0)
        );
      case "기차":
        return Number(cost.train || 0);
      case "버스":
        return Number(cost.bus || 0);
      case "항공":
        return (
          Number(cost.air || 0) +
          Number(cost.airParking || 0)
        );
      default:
        return Number(cost.etc || 0);
    }
  })();

  const total =
    meal +
    daily +
    lodgingValue +
    transportTotal;

  /* ================= 저장 ================= */
  const saveImage = async () => {
    const canvas = await html2canvas(ref.current, {
      scale: 2,
    });

    const a = document.createElement("a");
    a.download = "출장비.png";
    a.href = canvas.toDataURL();
    a.click();
  };

  const savePDF = async () => {
    const canvas = await html2canvas(ref.current, {
      scale: 2,
    });

    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const w =
      pdf.internal.pageSize.getWidth();
    const h =
      (canvas.height * w) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save("출장비.pdf");
  };

  return (
    <div style={bg}>
      <div ref={ref} style={wrap}>
        <Header />

        {/* 기본정보 */}
        <Section title="기본 정보">
          <Grid>
            <Input
              label="이름"
              value={form.name}
              onChange={(v) =>
                setForm({ ...form, name: v })
              }
            />
            <Input
              label="소속"
              value={form.dept}
              onChange={(v) =>
                setForm({ ...form, dept: v })
              }
            />

            <Select
              label="직급"
              value={form.position}
              onChange={(v) =>
                setForm({
                  ...form,
                  position: v,
                })
              }
              options={[
                "교수/부교수",
                "조교수/연구원/학생",
              ]}
            />

            <Select
              label="출장구분"
              value={form.type}
              onChange={(v) =>
                setForm({ ...form, type: v })
              }
              options={["국내", "해외"]}
            />

            <Select
              label="교통수단"
              value={form.transport}
              onChange={(v) =>
                setForm({
                  ...form,
                  transport: v,
                })
              }
              options={[
                "자동차",
                "기차",
                "버스",
                "항공",
                "기타",
              ]}
              disabled={form.type === "해외"}
            />

            <Input
              label="시작일"
              type="date"
              value={form.start}
              onChange={(v) =>
                setForm({
                  ...form,
                  start: v,
                })
              }
            />

            <Input
              label="종료일"
              type="date"
              value={form.end}
              onChange={(v) =>
                setForm({
                  ...form,
                  end: v,
                })
              }
            />
          </Grid>
        </Section>

        {/* 식비 */}
        <Section title="식비 / 일비">
          <Grid>
            <Card title="식비" value={meal} />
            <Card title="일비" value={daily} />
          </Grid>
        </Section>

        {/* 숙박 */}
        <Section title="숙박비">
          <Grid>
            <Input
              label={
                isProfessor
                  ? "실비 지급"
                  : "숙박비"
              }
              value={lodgingValue}
              onChange={(v) =>
                setCost({
                  ...cost,
                  lodging: v,
                })
              }
              disabled={
                isOneDay || isProfessor
              }
            />

            {!isProfessor && (
              <div style={info}>
                기준: 서울 100,000 / 광역시 80,000 / 기타 70,000
              </div>
            )}

            {isOneDay && (
              <div style={info}>
                당일치기 출장은 숙박비가 제외됩니다
              </div>
            )}
          </Grid>
        </Section>

        {/* 교통 */}
        <Section title="교통비">
          <Grid>
            {form.transport === "항공" ? (
              <>
                <Input
                  label="항공비"
                  value={cost.air}
                  onChange={(v) =>
                    setCost({
                      ...cost,
                      air: v,
                    })
                  }
                />
                <Input
                  label="항공 주차비"
                  value={cost.airParking}
                  onChange={(v) =>
                    setCost({
                      ...cost,
                      airParking: v,
                    })
                  }
                />
              </>
            ) : form.transport === "자동차" ? (
              <>
                <Input
                  label="톨게이트"
                  value={cost.toll}
                  onChange={(v) =>
                    setCost({
                      ...cost,
                      toll: v,
                    })
                  }
                />
                <Input
                  label="주차비"
                  value={cost.parking}
                  onChange={(v) =>
                    setCost({
                      ...cost,
                      parking: v,
                    })
                  }
                />
                <Select
                  label="유종"
                  value={cost.fuel}
                  onChange={(v) =>
                    setCost({
                      ...cost,
                      fuel: v,
                    })
                  }
                  options={[
                    "휘발유",
                    "경유",
                    "LPG",
                    "전기차",
                    "하이브리드",
                  ]}
                />
              </>
            ) : (
              <Input
                label="교통비"
                value={
                  cost.train ||
                  cost.bus ||
                  cost.etc
                }
                onChange={(v) =>
                  setCost({
                    ...cost,
                    etc: v,
                  })
                }
              />
            )}
          </Grid>
        </Section>

        {/* 정산 */}
        <Section title="정산 요약">
          <Grid>
            <Card title="식비" value={meal} />
            <Card title="일비" value={daily} />
            <Card
              title="숙박"
              value={lodgingValue}
            />
            <Card
              title="교통"
              value={transportTotal}
            />
            <Card
              title="총액"
              value={total}
              highlight
            />
          </Grid>
        </Section>

        <div style={btnWrap}>
          <button style={btn} onClick={saveImage}>
            이미지 저장
          </button>
          <button style={btn} onClick={savePDF}>
            PDF 저장
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function Header() {
  return (
    <div style={header}>
      출장비 자동 정산 시스템
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

function Input(props) {
  return (
    <div style={field}>
      <label>{props.label}</label>
      <input
        type="text"
        value={props.value}
        onChange={(e) =>
          props.onChange(e.target.value)
        }
        disabled={props.disabled}
        style={input}
      />
    </div>
  );
}

function Select(props) {
  return (
    <div style={field}>
      <label>{props.label}</label>
      <select
        value={props.value}
        onChange={(e) =>
          props.onChange(e.target.value)
        }
        disabled={props.disabled}
        style={input}
      >
        {props.options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Card({ title, value, highlight }) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 12,
        background: highlight
          ? "#dbeafe"
          : "#f8fafc",
        textAlign: "center",
      }}
    >
      <div>{title}</div>
      <div style={{ fontWeight: "bold" }}>
        {Number(value || 0).toLocaleString()}원
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const bg = {
  background: "#f1f5f9",
  minHeight: "100vh",
  padding: 20,
  display: "flex",
  justifyContent: "center",
};

const wrap = {
  width: "100%",
  maxWidth: 850,
  background: "#fff",
  padding: 20,
  borderRadius: 14,
};

const header = {
  textAlign: "center",
  fontSize: 22,
  fontWeight: "bold",
  marginBottom: 20,
};

const section = { marginTop: 20 };

const sectionTitle = {
  fontSize: 18,
  fontWeight: "bold",
  color: "#1e3a8a",
};

const box = {
  border: "1px solid #ddd",
  padding: 12,
  borderRadius: 10,
};

const field = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const input = {
  width: "160px",
  padding: 8,
  marginTop: 4,
  textAlign: "center",
};

const Grid = ({ children }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      justifyItems: "center",
    }}
  >
    {children}
  </div>
);

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
  borderRadius: 8,
};

const info = {
  fontSize: 12,
  color: "#64748b",
  marginTop: 6,
  textAlign: "center",
};