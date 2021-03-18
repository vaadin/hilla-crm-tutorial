const path = require("path");
const { fromRollup } = require("@web/dev-server-rollup");
const { esbuildPlugin } = require("@web/dev-server-esbuild");
const { importMapsPlugin } = require("@web/dev-server-import-maps");
const rollupAlias = require("@rollup/plugin-alias");

const alias = fromRollup(rollupAlias);

const projectRootDir = path.resolve(__dirname);

const MOCKS = "/frontend/tests/mocks";

module.exports = {
  nodeResolve: true,
  plugins: [
    esbuildPlugin({ ts: true }),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            // use mobx dev build to avoid error due to `process.env`
            mobx: "./node_modules/mobx/dist/mobx.esm.development.js",
            // mock theme to avoid using plugins to import CSS
            "Frontend/generated/theme": `${MOCKS}/theme.js`,
            // mock Fusion endpoints
            "Frontend/generated/CrmEndpoint": `${MOCKS}/CrmEndpoint.js`,
          },
        },
      },
    }),
    alias({
      entries: [
        {
          find: "Frontend",
          replacement: path.resolve(projectRootDir, "frontend"),
        },
      ],
    }),
  ],
};
