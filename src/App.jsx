import React from "react";

export default function App() {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
        background: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "20px",
          padding: "30px",
        }}
      >
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          출장비 지급 신청
        </h1>

        <p style={{ color: "#64748b", marginBottom: "30px" }}>
          출장 정보를 입력해주세요.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <label>신청자명</label>
            <input
              type="text"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
              }}
            />
          </div>

          <div>
            <label>소속</label>
            <input
              type="text"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
              }}
            />
          </div>

          <div>
            <label>출장 시작일</label>
            <input
              type="date"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
              }}
            />
          </div>

          <div>
            <label>출장 종료일</label>
            <input
              type="date"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "40px",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
            }}
          >
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                <th style={{ padding: "16px" }}>날짜</th>
                <th>식대 제공 횟수</th>
                <th>회의비 사용 횟수</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={{ padding: "16px" }}>2026-05-21</td>

                <td>
                  <select style={{ padding: "10px" }}>
                    <option>0식</option>
                    <option>1식</option>
                    <option>2식</option>
                    <option>3식</option>
                  </select>
                </td>

                <td>
                  <select style={{ padding: "10px" }}>
                    <option>0회</option>
                    <option>1회</option>
                    <option>2회</option>
                    <option>3회</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: "30px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <div style={{ color: "#64748b" }}>숙박비 기준</div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
              서울 100,000원
            </div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <div style={{ color: "#64748b" }}>일비</div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
              20,000원
            </div>
          </div>

          <div
            style={{
              background: "#dbeafe",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <div style={{ color: "#2563eb" }}>최종 지급 예정액</div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#1d4ed8",
              }}
            >
              145,000원
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "40px",
            textAlign: "right",
            color: "#64748b",
          }}
        >
          저장한 이미지 또는 PDF 파일을 사업단 담당자에게 제출해주세요.
        </div>
      </div>
    </div>
  );
}