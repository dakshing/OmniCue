# Data Residency, Security Policies, and SOC2 Compliance

## Commitment to Security
Our organization is committed to maintaining the highest standards of data security and privacy. We undergo annual independent audits to maintain our **SOC2 Type II** compliance certification.

## Data Encryption
- **At Rest**: All customer databases, backups, and file storage are encrypted at rest using AES-256 encryption. Key management is handled via AWS KMS with automatic key rotation every 90 days.
- **In Transit**: All data transmitted between clients and our servers, as well as internally between our microservices, is encrypted using TLS 1.3. We strictly enforce HTTP Strict Transport Security (HSTS).

## Data Residency and GDPR
To comply with global privacy regulations, including GDPR and CCPA, we offer strict data residency options:
- **US Region**: Data is stored in AWS `us-east-1` and `us-west-2`.
- **EU Region**: For European customers, data residency is strictly enforced. Their databases are physically isolated in our Frankfurt (`eu-central-1`) data centers. No customer data leaves the EU boundary.
- **APAC Region**: Hosted in Sydney (`ap-southeast-2`).

## Access Control and Audit Logging
- **Least Privilege**: Internal access to production systems is governed by the principle of least privilege. Engineers are granted temporary, just-in-time (JIT) access via Teleport.
- **MFA**: Multi-factor authentication is mandatory for all employee accounts and highly recommended for all customer accounts.
- **Audit Logs**: Comprehensive audit logs are maintained for all administrative actions and data access events. Logs are stored immutably in an S3 bucket for 7 years to satisfy compliance requirements.
