import { useEffect, useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import { AuthContext } from "../context/AuthContext";

const Notifications = () => {
  const { notifications, dispatch } = useContext(TaskContext);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const t = token || localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/notifications`,
        {
          headers: { Authorization: t ? `Bearer ${t}` : "" },
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error obteniendo notificaciones");
      }
      const data = await res.json();
      // asumo response: { ok: true, notifications: [...] }
      dispatch({
        type: "SET_NOTIFICATIONS",
        payload: data.notifications || [],
      });
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      const t = token || localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/notifications/${id}/read`,
        {
          method: "POST",
          headers: { Authorization: t ? `Bearer ${t}` : "" },
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error marcando notificación");
      }
      // refrescar lista
      await fetchNotifications();
    } catch (err) {
      console.error("markRead error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  return (
    <div className="notifications-widget" style={{ maxWidth: 360 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ margin: 0 }}>Notificaciones</h4>
        <span style={{ fontSize: 12, color: "#555" }}>
          {unreadCount} no leídas
        </span>
      </div>

      {loading && <div style={{ marginTop: 8 }}>Cargando...</div>}
      {error && <div style={{ marginTop: 8, color: "red" }}>{error}</div>}

      <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
        {(notifications || []).length === 0 && !loading && (
          <li style={{ color: "#666" }}>No hay notificaciones</li>
        )}
        {(notifications || []).map((n) => (
          <li
            key={n._id || n.id || Math.random()}
            style={{
              padding: "8px",
              marginBottom: 8,
              background: n.read ? "#f6f6f6" : "#fff8e1",
              border: "1px solid #eaeaea",
              borderRadius: 6,
            }}
          >
            <div style={{ fontWeight: n.read ? 400 : 600 }}>{n.title}</div>
            <div style={{ fontSize: 13, color: "#333", marginTop: 4 }}>
              {n.body}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              {!n.read && (
                <button
                  onClick={() => markRead(n._id)}
                  style={{
                    padding: "6px 8px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Marcar leída
                </button>
              )}
              <small style={{ color: "#777", marginLeft: "auto" }}>
                {new Date(
                  n.createdAt || n.created_at || Date.now()
                ).toLocaleString()}
              </small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
