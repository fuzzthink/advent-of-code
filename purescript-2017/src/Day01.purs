module Day01 (run) where

import Prelude
import Effect (Effect)
import Util.File (readChars)
import Util.String (log2)
import Data.Array (drop, filter, length, take, zip)
import Data.Int (fromString)
import Data.Filterable (filterMap)
import Data.Foldable (sum)
import Data.Tuple (fst, snd)


sumIfEqNextI :: Array String -> Int -> Int
sumIfEqNextI xs i = do 
  let
    xi = xs # filterMap fromString 
    xi' = drop i xi <> take i xi
  zip xi xi'
    # filter (\t -> fst t == snd t)
    # map (\t -> fst t)
    # sum
    
run :: Effect Unit
run = do
  strs <- readChars "./data/day01.txt"
  log2 "Part 1 sum: " $ sumIfEqNextI strs 1
  log2 "Part 2 sum: " $ sumIfEqNextI strs $ (strs # length)/2