module App

open Fable.Import.Node.Exports

Day07.run ("data/07.txt" |> fs.readFileSync |> sprintf "%A")