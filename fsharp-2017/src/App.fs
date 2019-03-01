module App

open Fable.Import.Node.Exports

Day05.run ("data/05.txt" |> fs.readFileSync |> sprintf "%A")
