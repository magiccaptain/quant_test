import fs from "fs";
import path from "path";
import readLastLines from "read-last-lines";

const side = "BUY";
const scalar = 45;
const start_time = "09:45:00";
const end_time = "10:15:00";

async function readOpDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  // console.log(files.map((f) => f.name));

  // const filepath = path.join("/");

  const trade_list = [];

  for (const file of files) {
    const { name } = file;
    const filepath = path.join(dir, name);
    const ticker = name.split(".")[0];

    const lastLine = await readLastLines.read(filepath, 1);

    const row = lastLine.split(",");

    const side = row[1];
    const qty = parseInt(row[row.length - 2]);
    let market;

    if (ticker.startsWith("00")) {
      market = "SZ";
    }

    if (ticker.startsWith("300")) {
      market = "SZ";
    }

    if (ticker.startsWith("60")) {
      market = "SH";
    }

    if (qty > 0) {
      trade_list.push({
        ticker,
        side,
        quantity: qty,
        market,
      });
    }
  }

  const params = JSON.stringify({
    start_time,
    end_time,
    trade_list,
  });

  console.log(params);
}

// readOpDir("./op");

function parseEntrusts(filename) {
  const content = fs.readFileSync(filename, "utf-8");
  const lines = content.split("\n");

  const entrusts = {};

  lines.forEach((line) => {
    const row = line.split(",");
    const ticker = row[0];
    const qty = row[1] ? parseInt(row[1]) : 0;

    const entrust = {};

    if (ticker) {
      // entrusts[ticker] = qty;
      entrust.qty = qty;
      entrust.ticker = ticker;

      if (entrust.ticker.startsWith("00")) {
        entrust.market = "SZ";
      }

      if (entrust.ticker.startsWith("300")) {
        entrust.market = "SZ";
      }

      if (entrust.ticker.startsWith("60")) {
        entrust.market = "SH";
      }
    }

    if (ticker && entrust.market) {
      entrusts[ticker] = entrust;
    }
  });

  return entrusts;
}

function main() {
  const entrusts1 = parseEntrusts("./target.csv");

  // console.log(entrusts1);

  const entrusts2 = parseEntrusts("./target2.csv");

  const trade_list = Object.keys(entrusts1).map((ticker) => {
    const entrust = entrusts1[ticker];

    return {
      ticker,
      market: entrust.market,
    };
  });

  // const trade_list = Object.keys(entrusts2)
  //   .map((ticker) => {
  //     const entrust2 = entrusts2[ticker];
  //     const entrust1 = entrusts1[ticker];

  //     if (ticker === "300363") {
  //       console.log(entrust2, entrust1);
  //     }

  //     const quantity = entrust1 ? entrust2.qty - entrust1.qty : entrust2.qty;

  //     return {
  //       ticker,
  //       market: entrust2.market,
  //       quantity: Math.abs(quantity * scalar),
  //       side: quantity > 0 ? "BUY" : "SELL",
  //     };
  //   })
  //   .filter((e) => e.quantity != 0);

  // const trade_list = Object.keys(entrusts1)
  //   .map((ticker) => {
  //     if (ticker.startsWith("300")) {
  //       const entrust = entrusts1[ticker];
  //       return {
  //         ticker,
  //         market: entrust.market,
  //         quantity: Math.abs(entrust.qty * scalar),
  //         side: entrust.qty > 0 ? "BUY" : "SELL",
  //       };
  //     }
  //   })
  //   .filter(Boolean)
  //   .filter((e) => e.quantity > 0);

  const params = JSON.stringify({
    start_time,
    end_time,
    trade_list,
  });

  console.log(params);

  // const content = fs.readFileSync("./target.csv", "utf-8");

  // const lines = content.split("\n");

  // const trade_list = lines
  //   .map((line) => {
  //     const row = line.split(",");

  //     const ticker = row[0];
  //     const qty = row[1];

  //     if (ticker && qty) {
  //       const market = Object.keys(MarketHeaders).find((m) => {
  //         return ticker.startsWith(MarketHeaders[m]);
  //       });

  //       if (market) {
  //         return {
  //           market,
  //           ticker,
  //           side,
  //           quantity: parseInt(qty) * scalar,
  //         };
  //       }
  //     }
  //   })
  //   .filter(Boolean);

  // console.log(
  //   JSON.stringify({
  //     start_time,
  //     end_time,
  //     trade_list,
  //   })
  // );
}

// main();
