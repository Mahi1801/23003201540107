"use client";
import { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, Chip, CircularProgress, List, ListItem,
  Button, Container, TextField, Select, MenuItem,
  FormControl, InputLabel, Divider,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import StarIcon from "@mui/icons-material/Star";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import { fetchAllNotifications } from "@/lib/api";
import { Notification, WEIGHT } from "@/lib/types";
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

const RANK_COLORS = ["#f59e0b", "#94a3b8", "#b45309"];

export default function PriorityPage() {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState<string>("All");

  useEffect(() => {
    fetchAllNotifications()
      .then((data: Notification[]) => {
        setAllNotifications(data);
        setReadIds(getReadIds());
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // Client-side filtering + sorting — this is the fix for the blank filter bug
  const notifications = useMemo(() => {
    let filtered = allNotifications;
    if (filterType !== "All") {
      filtered = allNotifications.filter((n) => n.Type === filterType);
    }
    const sorted = [...filtered].sort((a, b) => {
      const weightDiff = (WEIGHT[b.Type] || 0) - (WEIGHT[a.Type] || 0);
      if (weightDiff !== 0) return weightDiff;
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    });
    return sorted.slice(0, topN);
  }, [allNotifications, filterType, topN]);

  const handleRead = (id: string) => {
    markAsRead(id);
    setReadIds(new Set(getReadIds()));
  };

  const handleTopNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) setTopN(val);
  };

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
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
                <StarIcon sx={{ color: "#f59e0b", fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    Priority Inbox
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Top {notifications.length} ranked by importance
                  </Typography>
                </Box>
              </Box>
              <Link href="/">
                <Button
                  variant="outlined"
                  startIcon={<NotificationsIcon />}
                  sx={{
                    borderColor: "rgba(99,102,241,0.4)",
                    color: "#a5b4fc",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    px: 2.5,
                    "&:hover": { borderColor: "#6366f1", bgcolor: "rgba(99,102,241,0.08)" },
                  }}
                >
                  All Notifications
                </Button>
              </Link>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Controls */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
              p: 2,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <TextField
              id="top-n-input"
              label="Top N"
              type="number"
              value={topN}
              onChange={handleTopNChange}
              slotProps={{ htmlInput: { min: 1, max: 50 } }}
              size="small"
              sx={{
                width: 110,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="type-filter-label">Filter Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter-select"
                value={filterType}
                label="Filter Type"
                onChange={(e) => setFilterType(e.target.value as string)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Placement">
                  <Chip label="Placement" color="success" size="small" sx={{ mr: 1 }} />
                </MenuItem>
                <MenuItem value="Result">
                  <Chip label="Result" color="warning" size="small" sx={{ mr: 1 }} />
                </MenuItem>
                <MenuItem value="Event">
                  <Chip label="Event" color="info" size="small" sx={{ mr: 1 }} />
                </MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Showing <strong style={{ color: "#a5b4fc" }}>{notifications.length}</strong> result{notifications.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </Box>

          {/* List */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <CircularProgress sx={{ color: "primary.main" }} />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", mt: 10 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                mt: 6,
                p: 5,
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Typography sx={{ color: "text.secondary", fontSize: "1rem" }}>
                No notifications found for <strong>{filterType}</strong> type.
              </Typography>
              <Button
                variant="text"
                onClick={() => setFilterType("All")}
                sx={{ mt: 2, color: "primary.main", textTransform: "none" }}
              >
                Clear filter
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((n, index) => {
                const isRead = readIds.has(n.ID);
                const rankColor = index < 3 ? RANK_COLORS[index] : "rgba(255,255,255,0.2)";
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
                      {/* Rank badge */}
                      <Box
                        sx={{
                          minWidth: 32,
                          height: 32,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: `${rankColor}22`,
                          border: `2px solid ${rankColor}`,
                          flexShrink: 0,
                        }}
                      >
                        <Typography sx={{ fontWeight: 700, fontSize: "0.75rem", color: rankColor }}>
                          {index + 1}
                        </Typography>
                      </Box>

                      {/* Unread dot */}
                      <Box sx={{ minWidth: 10, flexShrink: 0 }}>
                        {!isRead && (
                          <CircleIcon sx={{ fontSize: 10, color: "primary.main" }} />
                        )}
                      </Box>

                      {/* Content */}
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

                      {/* Type chip */}
                      <Chip
                        label={n.Type}
                        color={TYPE_COLORS[n.Type] || "default"}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: "0.7rem", flexShrink: 0 }}
                      />
                    </ListItem>
                    {index < notifications.length - 1 && (
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