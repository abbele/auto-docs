"use client";
import { useState } from "react";
import { useAllResponses } from "../../lib/useWorkshopResponses";
import { useWorkshopQuestions } from "../../lib/useWorkshopQuestions";

const workshopQuestions = [
  { id: 1, question: "Per chi documentiamo? (Agenti AI, Colleghi, PM)" },
  { id: 2, question: "Quanto cambiamo il codice per l'automazione?" },
  { id: 3, question: "Per chi commentiamo? (Umani vs Parser)" },
  { id: 4, question: "Dove vive la verità? (Repo vs esterno)" },
];

export default function AdminPage() {
  const { allResponses, loading } = useAllResponses();
  const { customQuestions, loading: questionsLoading } = useWorkshopQuestions();
  const [selectedQuestionFilter, setSelectedQuestionFilter] = useState("all");
  const [showTab, setShowTab] = useState("responses"); // "responses" or "questions"

  // Combine predefined and custom questions
  const allQuestions = [
    ...workshopQuestions,
    ...customQuestions.map(q => ({
      id: q.id,
      question: q.question,
      author: q.author,
      isCustom: true
    }))
  ];

  const filteredResponses = selectedQuestionFilter === "all" 
    ? allResponses 
    : allResponses.filter(r => r.questionId === Number(selectedQuestionFilter));

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(filteredResponses, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workshop-responses-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSV = () => {
    const headers = ["Timestamp", "Question", "Name", "Answer"];
    const rows = filteredResponses.map(r => [
      r.timestampISO || "",
      `"${(r.question || "").replace(/"/g, '""')}"`,
      `"${(r.name || "").replace(/"/g, '""')}"`,
      `"${(r.answer || "").replace(/"/g, '""')}"`,
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workshop-responses-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatsByQuestion = () => {
    const stats = {};
    allQuestions.forEach(q => {
      stats[q.id] = {
        question: q.question,
        count: allResponses.filter(r => r.questionId === q.id).length,
        isCustom: q.isCustom || false
      };
    });
    return stats;
  };

  const stats = getStatsByQuestion();

  const exportQuestionsAsJSON = () => {
    const dataStr = JSON.stringify(customQuestions, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workshop-questions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#1E1E1E", 
      color: "#D4D4D4",
      fontFamily: "'Cascadia Code', 'Fira Code', monospace",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            Workshop Responses - Admin Panel
          </h1>
          <p style={{ color: "#808080", fontSize: 14 }}>
            Visualizza ed esporta tutte le risposte e domande del workshop
          </p>
        </header>

        {/* Tabs */}
        <div style={{ 
          display: "flex", 
          gap: 12,
          marginBottom: 32,
          borderBottom: "1px solid #3C3C3C"
        }}>
          <button
            onClick={() => setShowTab("responses")}
            style={{
              padding: "12px 24px",
              background: showTab === "responses" ? "#007ACC" : "transparent",
              color: showTab === "responses" ? "#fff" : "#808080",
              border: "none",
              borderBottom: showTab === "responses" ? "2px solid #007ACC" : "2px solid transparent",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit"
            }}
          >
            💬 Risposte ({allResponses.length})
          </button>
          <button
            onClick={() => setShowTab("questions")}
            style={{
              padding: "12px 24px",
              background: showTab === "questions" ? "#007ACC" : "transparent",
              color: showTab === "questions" ? "#fff" : "#808080",
              border: "none",
              borderBottom: showTab === "questions" ? "2px solid #007ACC" : "2px solid transparent",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit"
            }}
          >
            ❓ Domande Custom ({customQuestions.length})
          </button>
        </div>

        {loading || questionsLoading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#808080" }}>
            Caricamento...
          </div>
        ) : showTab === "responses" ? (
          <>
            {/* Stats */}
            <div style={{ 
              background: "#252526", 
              borderRadius: 8, 
              padding: 24, 
              marginBottom: 32,
              border: "1px solid #3C3C3C"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#fff" }}>
                📊 Statistiche
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                <div style={{ background: "#1E1E1E", padding: 16, borderRadius: 6, border: "1px solid #3C3C3C" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#007ACC", marginBottom: 4 }}>
                    {allResponses.length}
                  </div>
                  <div style={{ fontSize: 12, color: "#808080" }}>Risposte Totali</div>
                </div>
                {Object.values(stats).map(stat => (
                  <div key={stat.question} style={{ background: "#1E1E1E", padding: 16, borderRadius: 6, border: "1px solid #3C3C3C" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#6A9955", marginBottom: 4 }}>
                      {stat.count}
                    </div>
                    <div style={{ fontSize: 11, color: "#808080", lineHeight: 1.4 }}>{stat.question}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters & Actions */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: 24,
              gap: 16,
              flexWrap: "wrap"
            }}>
              <div>
                <label style={{ fontSize: 12, color: "#808080", marginRight: 8 }}>Filtra per domanda:</label>
                <select 
                  value={selectedQuestionFilter}
                  onChange={(e) => setSelectedQuestionFilter(e.target.value)}
                  style={{
                    background: "#252526",
                    color: "#D4D4D4",
                    border: "1px solid #3C3C3C",
                    borderRadius: 4,
                    padding: "8px 12px",
                    fontSize: 13,
                    fontFamily: "inherit",
                    cursor: "pointer"
                  }}
                >
                  <option value="all">Tutte ({allResponses.length})</option>
                  {workshopQuestions.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.question} ({stats[q.id]?.count || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={exportAsJSON}
                  disabled={filteredResponses.length === 0}
                  style={{
                    background: "#007ACC",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: filteredResponses.length > 0 ? "pointer" : "not-allowed",
                    opacity: filteredResponses.length > 0 ? 1 : 0.5
                  }}
                >
                  📥 Export JSON
                </button>
                <button
                  onClick={exportAsCSV}
                  disabled={filteredResponses.length === 0}
                  style={{
                    background: "#6A9955",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: filteredResponses.length > 0 ? "pointer" : "not-allowed",
                    opacity: filteredResponses.length > 0 ? 1 : 0.5
                  }}
                >
                  📥 Export CSV
                </button>
              </div>
            </div>

            {/* Responses List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filteredResponses.length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "60px 20px", 
                  color: "#808080",
                  background: "#252526",
                  borderRadius: 8,
                  border: "1px solid #3C3C3C"
                }}>
                  Nessuna risposta trovata
                </div>
              ) : (
                filteredResponses.map((response, index) => (
                  <div 
                    key={response.id} 
                    style={{
                      background: "#252526",
                      border: "1px solid #3C3C3C",
                      borderRadius: 8,
                      padding: 20
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 16, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#007ACC", marginBottom: 4 }}>
                          {response.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#808080" }}>
                          {response.question}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: "#808080", whiteSpace: "nowrap" }}>
                        {response.timestampISO 
                          ? new Date(response.timestampISO).toLocaleString('it-IT')
                          : response.timestamp?.toDate 
                            ? response.timestamp.toDate().toLocaleString('it-IT')
                            : 'Data non disponibile'
                        }
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: 13, 
                      color: "#D4D4D4", 
                      lineHeight: 1.6,
                      background: "#1E1E1E",
                      padding: 16,
                      borderRadius: 6,
                      border: "1px solid #3C3C3C"
                    }}>
                      {response.answer}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* Questions Tab */}
            <div style={{ 
              background: "#252526", 
              borderRadius: 8, 
              padding: 24, 
              marginBottom: 32,
              border: "1px solid #3C3C3C"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#fff" }}>
                📊 Statistiche Domande
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                <div style={{ background: "#1E1E1E", padding: 16, borderRadius: 6, border: "1px solid #3C3C3C" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#007ACC", marginBottom: 4 }}>
                    {workshopQuestions.length}
                  </div>
                  <div style={{ fontSize: 12, color: "#808080" }}>Domande Predefinite</div>
                </div>
                <div style={{ background: "#1E1E1E", padding: 16, borderRadius: 6, border: "1px solid #3C3C3C" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#6A9955", marginBottom: 4 }}>
                    {customQuestions.length}
                  </div>
                  <div style={{ fontSize: 12, color: "#808080" }}>Domande Custom</div>
                </div>
                <div style={{ background: "#1E1E1E", padding: 16, borderRadius: 6, border: "1px solid #3C3C3C" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#C586C0", marginBottom: 4 }}>
                    {allQuestions.length}
                  </div>
                  <div style={{ fontSize: 12, color: "#808080" }}>Domande Totali</div>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end",
              marginBottom: 24
            }}>
              <button
                onClick={exportQuestionsAsJSON}
                disabled={customQuestions.length === 0}
                style={{
                  background: "#007ACC",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: customQuestions.length > 0 ? "pointer" : "not-allowed",
                  opacity: customQuestions.length > 0 ? 1 : 0.5
                }}
              >
                📥 Export Domande JSON
              </button>
            </div>

            {/* Questions List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8 }}>
                Domande Predefinite del Workshop
              </h3>
              {workshopQuestions.map((question, index) => (
                <div 
                  key={question.id}
                  style={{
                    background: "#252526",
                    border: "1px solid #3C3C3C",
                    borderRadius: 8,
                    padding: 20
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: "#D4D4D4", lineHeight: 1.6 }}>
                        {question.question}
                      </div>
                    </div>
                    <div style={{
                      background: "#1E1E1E",
                      padding: "4px 12px",
                      borderRadius: 4,
                      fontSize: 12,
                      color: "#007ACC",
                      whiteSpace: "nowrap"
                    }}>
                      {stats[question.id]?.count || 0} risposte
                    </div>
                  </div>
                </div>
              ))}

              {customQuestions.length > 0 && (
                <>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginTop: 24, marginBottom: 8 }}>
                    Domande Custom dei Partecipanti
                  </h3>
                  {customQuestions.map((question) => (
                    <div 
                      key={question.id}
                      style={{
                        background: "#252526",
                        border: "1px solid #6A9955",
                        borderRadius: 8,
                        padding: 20
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 16, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontSize: 14, color: "#D4D4D4", lineHeight: 1.6, marginBottom: 8 }}>
                            {question.question}
                          </div>
                          <div style={{ fontSize: 11, color: "#808080", fontStyle: "italic" }}>
                            Proposta da: {question.author}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                          <div style={{
                            background: "#1E1E1E",
                            padding: "4px 12px",
                            borderRadius: 4,
                            fontSize: 12,
                            color: "#6A9955",
                            whiteSpace: "nowrap"
                          }}>
                            {stats[question.id]?.count || 0} risposte
                          </div>
                          <div style={{ fontSize: 10, color: "#808080", whiteSpace: "nowrap" }}>
                            {question.timestamp?.toDate 
                              ? question.timestamp.toDate().toLocaleString('it-IT')
                              : 'Data non disponibile'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {customQuestions.length === 0 && (
                <div style={{ 
                  textAlign: "center", 
                  padding: "40px 20px", 
                  color: "#808080",
                  background: "#252526",
                  borderRadius: 8,
                  border: "1px solid #3C3C3C",
                  fontStyle: "italic"
                }}>
                  Nessuna domanda custom ancora. I partecipanti possono aggiungerne dal pannello Copilot.
                </div>
              )}
            </div>
          </>
        )}

        <footer style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid #3C3C3C", textAlign: "center" }}>
          <a 
            href="/"
            style={{ 
              color: "#007ACC", 
              textDecoration: "none",
              fontSize: 13 
            }}
          >
            ← Torna alla presentazione
          </a>
        </footer>
      </div>
    </div>
  );
}
