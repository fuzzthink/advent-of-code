module Util.File where

import Prelude

import Data.Filterable (filterMap)
import Data.Maybe (Maybe)
import Data.String (Pattern(..), split, trim)
import Effect (Effect)
import Node.Encoding (Encoding(..))
import Node.FS.Sync (readTextFile)

readLines :: String -> Effect (Array String)
readLines filename = do
  contents <- readTextFile UTF8 filename
  pure $ split (Pattern "\n") contents # map trim

readChars :: String -> Effect (Array String)
readChars filename = do
  contents <- readTextFile UTF8 filename
  pure $ split (Pattern "") contents

readLinesOf :: ∀ t. (String → Maybe t) → String → Effect (Array (Array t))
readLinesOf parser filename = do
  lines <- readLines filename
  pure $ lines 
    # map (\line -> line
      # split (Pattern "\t")
      # filterMap parser
    )
