# Legacy API v3 Sunset Schedule and Migration Guide

## Notice of Deprecation
Please be advised that **API v3** will be officially deprecated by the end of Q4 2026. This decision allows us to focus our engineering efforts on the more performant, flexible, and secure GraphQL-based **API v4**.

## Timeline
- **Announcement**: January 15, 2026
- **Feature Freeze**: March 1, 2026 (No new features will be added to v3)
- **Warning Headers Introduced**: October 1, 2026 (All v3 responses will include a `Deprecation-Warning` HTTP header)
- **Brownouts**: November 2026 (Periodic 1-hour windows where v3 will intentionally return 410 Gone to highlight remaining usage)
- **Complete Shutdown**: December 31, 2026 (All v3 endpoints will be permanently disabled)

## Migration to API v4 (GraphQL)
All integrators must migrate to the GraphQL API v4 endpoints before the shutdown date. 

### Key Differences
1. **Endpoint**: Instead of multiple REST endpoints (`/api/v3/users`, `/api/v3/projects`), v4 uses a single endpoint: `/api/v4/graphql`.
2. **Payloads**: You must specify exactly what fields you want returned, which reduces over-fetching.
3. **Authentication**: v4 requires Bearer token authentication via OAuth2; legacy API keys are no longer supported.

## Resources
- [API v4 Documentation and Explorer](https://developer.company.com/v4)
- [v3 to v4 Migration Cheat Sheet](https://developer.company.com/migration-guide)
- For Enterprise customers needing migration assistance, please contact your TAM.
