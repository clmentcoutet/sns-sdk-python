"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Example = void 0;
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const sns_react_1 = require("@bonfida/sns-react");
const react_1 = require("react");
const Example = () => {
    var _a, _b, _c, _d, _e;
    const { connection } = (0, wallet_adapter_react_1.useConnection)();
    const { publicKey } = (0, wallet_adapter_react_1.useWallet)();
    const bonfidaOwner = (0, sns_react_1.useDomainOwner)(connection, "bonfida");
    const domains = (0, sns_react_1.useDomainsForOwner)(connection, publicKey);
    const [searchInput, updateSearchInput] = (0, react_1.useState)("");
    const [searchQuery, updateSearchQuery] = (0, react_1.useState)("");
    const searchResult = (0, sns_react_1.useSearch)({ connection, domain: searchQuery });
    const domainSuggestions = (0, sns_react_1.useDomainSuggestions)(connection, searchQuery);
    const topDomainsSales = (0, sns_react_1.useTopDomainsSales)();
    return (<div className="flex flex-col h-full gap-3 px-10">
      <div className="flex space-x-4 text-white">
        <p>Owner of bonfida.sol: </p>{" "}
        <p className="font-medium">{(_a = bonfidaOwner.data) === null || _a === void 0 ? void 0 : _a.toBase58()}</p>
      </div>
      <div className="text-white">
        <p>Your domains:</p>
        {(_b = domains === null || domains === void 0 ? void 0 : domains.data) === null || _b === void 0 ? void 0 : _b.map((e) => {
            return (<p key={e.pubkey.toBase58()}>
              - {e.domain}.sol ({e.pubkey.toBase58()})
            </p>);
        })}
      </div>

      <div className="text-white">
        <p>Search for domain availability and suggestions:</p>
        <form onSubmit={(event) => {
            event.preventDefault();
            updateSearchQuery(searchInput);
        }} className="flex gap-2">
          <input type="text" value={searchInput} placeholder="Enter domain" className="text-black" onChange={(e) => updateSearchInput(e.target.value)}/>
          <button>Submit</button>
        </form>
        <div className="py-2">
          {searchResult.isLoading && "Loading..."}
          {(_c = searchResult.data) === null || _c === void 0 ? void 0 : _c.map((e) => {
            return (<p key={e.domain}>
                Domain name: {e.domain}
                <br></br>
                Is available: {String(e.available)}
              </p>);
        })}
        </div>
        <hr></hr>
        <p>Domain suggestions:</p>
        {domainSuggestions.isLoading && "Loading..."}
        <table>
          <thead>
            <tr>
              <td>Domain name</td>
              <td>Available?</td>
            </tr>
          </thead>
          <tbody>
            {(_d = domainSuggestions.data) === null || _d === void 0 ? void 0 : _d.map((e) => {
            return (<tr key={e.domain}>
                  <td>{e.domain}</td>
                  <td>{String(e.available)}</td>
                </tr>);
        })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-white">
        <p>Top sales:</p>

        <table>
          <thead>
            <tr>
              <td>Domain name</td>
              <td>Price, $</td>
            </tr>
          </thead>
          <tbody>
            {(_e = topDomainsSales.data) === null || _e === void 0 ? void 0 : _e.map((e) => {
            return (<tr key={e.domain}>
                  <td>{e.domain}.sol</td>
                  <td>${e.price}</td>
                </tr>);
        })}
          </tbody>
        </table>
      </div>
    </div>);
};
exports.Example = Example;
