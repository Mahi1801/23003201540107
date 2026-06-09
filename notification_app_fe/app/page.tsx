"use client";
import { useEffect, useState } from "react";
import {
  Box, Typography, Chip, CircularProgress, List, ListItem,
  Button, Container, Divider
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import CircleIcon from "@mui/icons-material/Circle";
import { fetchAllNotifications } from "@/lib/api";
import { Notification } from "@/lib/types";
import { getReadIds, markAsRead } from "@/lib/storage";
import Link from "next/link";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0f1117", paper: "#1a1d27" },
    primary: { main: "#6366f1" },
    success: { main: "#22c55e" },
    warning: { main: "#f59e0b" },
    info: { main: "#38bdf8" },
  },
  typography: { fontFamily: "Inter, sans-serif" },
});

const TYPE_COLORS: Record<string, "success" | "warning" | "info"> = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};

const TYPE_BG: Record<string, string> = {
  Placement: "rgba(34,197,94,0.08)",
  Result: "rgba(245,158,11,0.08)",
  Event: "rgba(56,189,248,0.08)",
};

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllNotifications()
      .then((data) => {
        setNotifications(data);
        setReadIds(getReadIds());
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const handleRead = (id: string) => {
    markAsRead(id);
    setReadIds(new Set(getReadIds()));
  };

  const unreadCount = notifications.filter((n) => !readIds.has(n.ID)).length;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Header */}
        <Box
          sx={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            bgcolor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 10,
            backdropFilter: "blur(12px)",
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
                <NotificationsIcon sx={{ color: "primary.main", fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    All Notifications
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {unreadCount} unread · {notifications.length} total
                  </Typography>
                </Box>
              </Box>
              <Link href="/priority">
                <Button
                  variant="contained"
                  startIcon={<StarIcon />}
                  sx={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    px: 2.5,
                    "&:hover": { background: "linear-gradient(135deg, #4f46e5, #7c3aed)" },
                  }}
                >
                  Priority Inbox
                </Button>
              </Link>
            </Box>
          </Container>
        </Box>

        {/* Content */}
        <Container maxWidth="md" sx={{ py: 4 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <CircularProgress sx={{ color: "primary.main" }} />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", mt: 10 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 10 }}>
              <Typography color="text.secondary">No notifications found.</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((n, idx) => {
                const isRead = readIds.has(n.ID);
                return (
                  <Box key={n.ID}>
                    <ListItem
                      onClick={() => handleRead(n.ID)}
                      sx={{
                        px: 2.5,
                        py: 1.8,
                        borderRadius: 2,
                        mb: 1,
                        cursor: "pointer",
                        bgcolor: isRead ? "rgba(255,255,255,0.02)" : TYPE_BG[n.Type] || "rgba(99,102,241,0.08)",
                        border: "1px solid",
                        borderColor: isRead ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.2)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: isRead ? "rgba(255,255,255,0.05)" : TYPE_BG[n.Type] || "rgba(99,102,241,0.12)",
                          borderColor: "rgba(99,102,241,0.4)",
                          transform: "translateY(-1px)",
                        },
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      {/* Unread dot */}
                      <Box sx={{ minWidth: 10 }}>
                        {!isRead && (
                          <CircleIcon sx={{ fontSize: 10, color: "primary.main" }} />
                        )}
                      </Box>

                      {/* Message & timestamp */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: isRead ? 400 : 600,
                            color: isRead ? "text.secondary" : "text.primary",
                            fontSize: "0.95rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {n.Message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.disabled" }}>
                          {new Date(n.Timestamp).toLocaleString()}
                        </Typography>
                      </Box>

                      {/* Chip */}
                      <Chip
                        label={n.Type}
                        color={TYPE_COLORS[n.Type] || "default"}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                      />
                    </ListItem>
                    {idx < notifications.length - 1 && (
                      <Divider sx={{ borderColor: "rgba(255,255,255,0.04)", mx: 1 }} />
                    )}
                  </Box>
                );
              })}
            </List>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}