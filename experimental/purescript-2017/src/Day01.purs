module Day01 (run) where

import Prelude
import Effect (Effect)
import Util.File (readChars)
import Util.String (log2)
import Data.Array (drop, length, take, zip)
import Data.Int as Int
import Data.Filterable (filterMap)
import Data.Foldable (sum)
import Data.Tuple (fst, snd)

-- | Iterate the xs chars, match each aginst the val at iCompare away.
-- | If vals equal, add to the sum. iCompare wraps to the front if > xs length.
sumIfEqNextI :: Array String -> Int -> Int
sumIfEqNextI xs iCompare = do
  let 
    xi = xs # filterMap Int.fromString
    xi' = drop iCompare xi <> take iCompare xi
  zip xi xi'
    # map (\pair -> if fst pair == snd pair then fst pair else 0)
    # sum
    
run :: Effect Unit
run = do
  strs <- readChars "data/day01.txt"
  log2 "Day 1.1 sum: " $ sumIfEqNextI strs 1
  log2 "Day 1.2 sum: " $ sumIfEqNextI strs $ (strs # length)/2