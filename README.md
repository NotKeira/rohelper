# RoHelper

RoHelper is a private, open-source Discord bot designed specifically for Roblox Scripters' Discord servers. It provides features such as job postings, portfolio sharing, ticket management, and more to streamline server operations and enhance user experience.

## Features

- **Job Posting**: Allows users to post job offers in designated channels.
- **Portfolio Sharing**: Enables users to share their portfolios for potential hiring opportunities.
- **Ticket Management**: Facilitates the creation and management of support or report tickets.
- **Server Information**: Displays server-specific details like roles, channels, and members.
- **Custom Tags**: Provides predefined tags for common server queries.
- **Pagination**: Implements paginated embeds for better navigation of large datasets.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rohelper
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     TOKEN=<your-bot-token>
     CLIENT_ID=<your-client-id>
     STAFF_ID=<staff-role-id>
     JOB_ID=<job-channel-id>
     PORTFOLIO_ID=<portfolio-channel-id>
     LOGS_CHANNEL_ID=<logs-channel-id>
     STAFF_CHANNEL_ID=<staff-approvals-channel-id>
     BLACKLIST_ROLE=<blacklist-role-id>
     ```

4. Build the project:
   ```bash
   pnpm build
   ```

5. Start the bot:
   ```bash
   pnpm start
   ```

## Development

For development purposes, use the following command to run the bot in watch mode:
```bash
pnpm dev
```

## License

This project is licensed under the **GNU GENERAL PUBLIC LICENSE V3**. See the [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please ensure your changes align with the project's goals and follow the coding standards.

## Disclaimer

RoHelper is a private bot and is not intended for resale. Redistribution is allowed only with proper attribution to the original creator.
