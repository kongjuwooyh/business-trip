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
  });

  const [mealProvided, setMealProvided] = useState(0);
  const [meetingMeals, setMeetingMeals] = useState(0);

  const [lodging, setLodging] = useState({
    region: "서울",
    amount: 0,
    shared: false,
    people: 2,
  });

  const [transport, setTransport] = useState(0);

  const mealUnit = 25000;
  const dailyAllowance = 20000;

  const lodgingLimit =
    form.position === "교수/부교수"
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

    const height =
      (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);

    pdf.save("출장비신청서.pdf");
  };

  return (
    <div
      style={{
        background: "#f1f5f9",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      <div
        ref={pageRef}
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "white",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "10px",
          }}
        >
          출장비 지급 신청
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "40px",
          }}
        >
          공무원 여비규정 기준 자동 계산
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          <Input
            label="신청자명"
            value={form.name}
            onChange={(v) =>
              setForm({ ...form, name: v })
            }
          />

          <Input
            label="소속"
            value={form.department}
            onChange={(v) =>
              setForm({ ...form, department: v })
            }
          />

          <div>
            <label>직급</label>
            <select
              value={form.position}
              onChange={(e) =>
                setForm({
                  ...form,
                  position: e.target.value,
                })
              }
              style={inputStyle}
            >
              <option>교수/부교수</option>
              <option>조교수/연구원/학생</option>
            </select>
          </div>

          <Input
            label="출장지"
            value={form.destination}
            onChange={(v) =>
              setForm({ ...form, destination: v })
            }
          />

          <div>
            <label>출장 시작일</label>
            <input
              type="date"
              style={inputStyle}
              value={form.startDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  startDate: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>출장 종료일</label>
            <input
              type="date"
              style={inputStyle}
              value={form.endDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  endDate: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div style={sectionStyle}>
          <h2>식대 및 회의비</h2>

          <div style={gridStyle}>
            <div>
              <label>식대 제공 횟수</label>
              <select
                style={inputStyle}
                value={mealProvided}
                onChange={(e) =>
                  setMealProvided(Number(e.target.value))
                }
              >
                <option value={0}>0식</option>
                <option value={1}>1식</option>
                <option value={2}>2식</option>
                <option value={3}>3식</option>
              </select>
            </div>

            <div>
              <label>회의비 사용 횟수</label>
              <select
                style={inputStyle}
                value={meetingMeals}
                onChange={(e) =>
                  setMeetingMeals(Number(e.target.value))
                }
              >
                <option value={0}>0회</option>
                <option value={1}>1회</option>
                <option value={2}>2회</option>
                <option value={3}>3회</option>
              </select>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2>숙박비</h2>

          <div style={gridStyle}>
            <div>
              <label>지역</label>

              <select
                style={inputStyle}
                value={lodging.region}
                onChange={(e) =>
                  setLodging({
                    ...lodging,
                    region: e.target.value,
                  })
                }
              >
                <option>서울</option>
                <option>광역시</option>
                <option>기타(제주 포함)</option>
              </select>
            </div>

            <div>
              <label>숙박비 기준</label>

              <div style={cardStyle}>
                {typeof lodgingLimit === "number"
                  ? `${lodgingLimit.toLocaleString()}원`
                  : lodgingLimit}
              </div>
            </div>

            <Input
              label="실제 숙박비"
              type="number"
              value={lodging.amount}
              onChange={(v) =>
                setLodging({
                  ...lodging,
                  amount: v,
                })
              }
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <label>
              <input
                type="checkbox"
                checked={lodging.shared}
                onChange={(e) =>
                  setLodging({
                    ...lodging,
                    shared: e.target.checked,
                  })
                }
              />
              &nbsp; 2인 이상 숙박
            </label>

            {lodging.shared && (
              <div style={{ marginTop: "10px" }}>
                <Input
                  label="숙박 인원 수"
                  type="number"
                  value={lodging.people}
                  onChange={(v) =>
                    setLodging({
                      ...lodging,
                      people: v,
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div style={sectionStyle}>
          <h2>교통비</h2>

          <Input
            label="교통비 입력"
            type="number"
            value={transport}
            onChange={setTransport}
          />
        </div>

        <div style={summaryGrid}>
          <SummaryCard
            title="식비 지급액"
            value={`${mealAmount.toLocaleString()}원`}
          />

          <SummaryCard
            title="일비"
            value={`${dailyAllowance.toLocaleString()}원`}
          />

          <SummaryCard
            title="숙박비"
            value={`${Number(
              lodging.amount
            ).toLocaleString()}원`}
          />

          <SummaryCard
            title="교통비"
            value={`${Number(
              transport
            ).toLocaleString()}원`}
          />

          <SummaryCard
            title="최종 지급 예정액"
            value={`${total.toLocaleString()}원`}
            blue
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            marginTop: "40px",
          }}
        >
          <button style={buttonStyle} onClick={saveImage}>
            이미지 저장
          </button>

          <button style={buttonStyle} onClick={savePDF}>
            PDF 저장
          </button>
        </div>

        <div
          style={{
            marginTop: "20px",
            textAlign: "right",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          저장한 이미지 또는 PDF 파일을 사업단 담당자에게 제출해주세요.
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>
      <label>{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

function SummaryCard({
  title,
  value,
  blue = false,
}) {
  return (
    <div
      style={{
        background: blue ? "#dbeafe" : "#f8fafc",
        padding: "24px",
        borderRadius: "18px",
      }}
    >
      <div
        style={{
          color: blue ? "#2563eb" : "#64748b",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: blue ? "#1d4ed8" : "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
};

const sectionStyle = {
  marginTop: "40px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
  marginTop: "20px",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(180px,1fr))",
  gap: "20px",
  marginTop: "40px",
};

const cardStyle = {
  background: "#f8fafc",
  padding: "14px",
  borderRadius: "12px",
  marginTop: "8px",
};

const buttonStyle = {
  padding: "14px 22px",
  borderRadius: "14px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};