module App

open Fable.Import.Node.Exports

Day03.run ("data/03.txt" |> fs.readFileSync |> sprintf "%A")
