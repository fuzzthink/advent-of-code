module Day01 (run) where

import Prelude
import Effect (Effect)
import Util.File (readChars)
import Util.String (log2)
import Data.Array (drop, filter, length, take, zip)
import Data.Int as Int
import Data.Filterable (filterMap)
import Data.Foldable (sum)
import Data.Tuple (fst, snd)

-- | Iterate the xs chars, match each aginst the val in idxToMatch away.
-- | If same val, add it to the sum. idxToMatch wraps to front if index is
-- | > array length.
sumIfEqNextI :: Array String -> Int -> Int
sumIfEqNextI xs idxToMatch = do 
  let
    xi = xs # filterMap Int.fromString
    xi' = drop idxToMatch xi <> take idxToMatch xi
  zip xi xi'
    # filter (\t -> fst t == snd t)
    # map (\t -> fst t)
    # sum
    
run :: Effect Unit
run = do
  strs <- readChars "./data/day01.txt"
  log2 "Day 1.1 sum: " $ sumIfEqNextI strs 1
  log2 "Day 1.2 sum: " $ sumIfEqNextI strs $ (strs # length)/2