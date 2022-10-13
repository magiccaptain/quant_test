import fs from "fs";
import moment from "moment";

/**
 * 获取市场
 * @param {string} ticker
 */
function getMarket(ticker) {
  if (ticker.startsWith("00")) {
    return "SZ";
  }

  if (ticker.startsWith("30")) {
    return "SZ";
  }

  if (ticker.startsWith("60")) {
    return "SH";
  }

  if (ticker.startsWith("688")) {
    return "SH";
  }
}

function main() {
  const content = fs.readFileSync("ybzt1.trade", "utf-8");
  const lines = content.split("\n");

  let ret = lines.map((l) => {
    const splitted = l.split(",");
    const ticker = splitted[0];
    const qty = parseInt(splitted[1]);
    const market = getMarket(ticker);

    if (Math.abs(qty) < 100) {
      console.log(ticker, qty > 0 ? "b" : "s", Math.abs(qty));

      return false;
    }

    if (market) {
      if (ticker.startsWith("688") && Math.abs(qty) < 200) {
        console.log(ticker, qty > 0 ? "b" : "s", Math.abs(qty));
        return false;
      }

      return [
        "1",
        `${ticker}.${market}`,
        qty > 0 ? "b" : "s",
        Math.abs(qty) - (Math.abs(qty) % 100),
      ].join(",");
    }
  });

  fs.writeFileSync(
    `./${moment().format("YYYYMMDD")}.csv`,
    ret.filter(Boolean).join("\n") + "\n" + "0"
  );

  // ret = lines.map((l) => {
  //   const splitted = l.split(",");
  //   const ticker = splitted[0];
  //   const qty = parseInt(splitted[1]);
  //   const market = getMarket(ticker);

  //   if (ticker.startsWith("688") && market) {
  //     return [
  //       "1",
  //       `${ticker}.${market}`,
  //       qty > 0 ? "b" : "s",
  //       Math.abs(qty),
  //     ].join(",");
  //   }
  // });

  // fs.writeFileSync(
  //   `./688_${moment().format("YYYYMMDD")}.csv`,
  //   ret.filter(Boolean).join("\n") + "\n" + "0"
  // );
}

main();
