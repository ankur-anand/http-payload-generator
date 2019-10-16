const logger = require("./logger");
const app = require("./app");
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Demo Server Running on the PORT: ${PORT}`);
});