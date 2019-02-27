module App

open Fable.Import.Node.Exports

Day04.run ("data/04.txt" |> fs.readFileSync |> sprintf "%A")
