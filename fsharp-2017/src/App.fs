module App

open Fable.Import.Node.Exports

Day02.run ("data/02.txt" |> fs.readFileSync |> sprintf "%A")
