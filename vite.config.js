import { readFileSync } from 'node:fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const mockDatabase = JSON.parse(
  readFileSync(new URL('./mock-db.json', import.meta.url), 'utf8'),
);

const localMockApi = () => ({
  name: 'local-mock-api',
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
      if (!pathname.startsWith('/api/')) return next();

      const sendJson = (statusCode, data) => {
        response.statusCode = statusCode;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(data));
      };

      try {
        if (pathname === '/api/admin/login' && request.method === 'POST') {
          let body = '';
          for await (const chunk of request) body += chunk;
          const credentials = JSON.parse(body || '{}');
          const admin = mockDatabase.adminUsers.find(
            (user) =>
              user.email === credentials.email &&
              user.password === credentials.password,
          );

          if (!admin) {
            return sendJson(422, {
              responseCode: 422,
              messages: { email: ['Invalid local demo credentials.'] },
            });
          }

          return sendJson(200, {
            responseCode: 200,
            data: {
              email: admin.email,
              first_name: admin.first_name,
              last_name: admin.last_name,
              role_id: 1,
              access_token: 'local-demo-token',
            },
          });
        }

        if (pathname === '/api/dealer/login' && request.method === 'POST') {
          let body = '';
          for await (const chunk of request) body += chunk;
          const credentials = JSON.parse(body || '{}');
          const user = mockDatabase.dealerUsers.find(
            (dealer) =>
              dealer.login === credentials.login &&
              dealer.password === credentials.password,
          );

          if (!user) {
            return sendJson(422, {
              responseCode: 422,
              messages: { login: ['Invalid local demo credentials.'] },
            });
          }

          const { password, ...userData } = user;
          return sendJson(200, {
            responseCode: 200,
            data: { user: userData, token: 'local-demo-token' },
          });
        }

        if (
          (pathname === '/api/admin/logout' || pathname === '/api/dealer/logout') &&
          request.method === 'POST'
        ) {
          return sendJson(200, { responseCode: 200, message: 'Logged out.' });
        }

        if (pathname === '/api/admin/dashboard' && request.method === 'GET') {
          return sendJson(200, {
            responseCode: 200,
            data: mockDatabase.dashboard,
          });
        }

        if (pathname === '/api/dealer/dashboard' && request.method === 'GET') {
          return sendJson(200, {
            responseCode: 200,
            data: mockDatabase.dashboard,
          });
        }

        if (/^\/api\/(admin|dealer)\/products\/\d+$/.test(pathname) && request.method === 'GET') {
          return sendJson(200, {
            responseCode: 200,
            data: {
              news: mockDatabase.dashboard.main_product.news,
              product_details: mockDatabase.dashboard.main_product.product_details,
              category: mockDatabase.dashboard.main_product.categories,
            },
          });
        }

        if (pathname === '/api/admin/get-alert' && request.method === 'GET') {
          return sendJson(200, {
            responseCode: 200,
            data: { alert_message: '' },
          });
        }

        return sendJson(404, { message: 'No local mock route for this request.' });
      } catch {
        return sendJson(400, { message: 'Invalid local mock request.' });
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), ...(env.VITE_USE_MOCK_API === 'true' ? [localMockApi()] : [])],
  };
})
