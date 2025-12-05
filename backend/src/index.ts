import { app, server } from './app';
import { open } from './database';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';

open();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

const port = app.get('port');
server.listen(port, () => console.log(`Server started on port ${port}`));
