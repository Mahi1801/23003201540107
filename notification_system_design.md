# Solution for Stage 1

# Problem
Users lose track of important notifications due to high volume and can't find the notification when  needed.

# Approach Used
Implemented a Priority Inbox that ranks notifications using two factors:

# 1. Weight (Type-based priority)
- Placement : 3 (highest)
- Result : 2
- Event : 1 (lowest)

# 2. Recency
- Among notifications with equal weight, newer ones rank higher.

# Sorting Logic
- Sort by weight descending first
- Break ties by Timestamp descending

# Handling New Notifications
- Since notifications are fetched live from the API each time, new notifications are automatically included in ranking on every call.
- No caching or DB needed. Always fresh, always sorted.

# Output
Returns top 10 notifications (default 10) as a sorted list fetched from the postman api.