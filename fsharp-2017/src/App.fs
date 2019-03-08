module App

open Fable.Import.Node.Exports

Day06.run ("data/06.txt" |> fs.readFileSync |> sprintf "%A")