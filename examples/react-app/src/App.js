"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPC_URL = void 0;
const react_1 = require("react");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_wallets_1 = require("@solana/wallet-adapter-wallets");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const Example_1 = require("./Example");
const react_query_1 = require("@tanstack/react-query");
const react_query_devtools_1 = require("@tanstack/react-query-devtools");
// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");
exports.RPC_URL = import.meta.env.VITE_RPC;
const queryClient = new react_query_1.QueryClient();
function App() {
    const wallets = (0, react_1.useMemo)(() => [new wallet_adapter_wallets_1.SolflareWalletAdapter()], []);
    return (<div className="min-h-screen bg-[#333]">
      <react_query_1.QueryClientProvider client={queryClient}>
        <wallet_adapter_react_1.ConnectionProvider endpoint={exports.RPC_URL}>
          <wallet_adapter_react_1.WalletProvider wallets={wallets} autoConnect>
            <wallet_adapter_react_ui_1.WalletModalProvider>
              <div className="flex px-10 py-20 space-x-3">
                <wallet_adapter_react_ui_1.WalletMultiButton />
                <wallet_adapter_react_ui_1.WalletDisconnectButton />
              </div>
              <Example_1.Example />
            </wallet_adapter_react_ui_1.WalletModalProvider>
          </wallet_adapter_react_1.WalletProvider>
        </wallet_adapter_react_1.ConnectionProvider>
        <react_query_devtools_1.ReactQueryDevtools initialIsOpen={false}/>
      </react_query_1.QueryClientProvider>
    </div>);
}
exports.default = App;
