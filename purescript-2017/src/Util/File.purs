module Util.File where

import Prelude-- (bind, pure, ($))
import Data.String (Pattern(..), split)
import Effect (Effect)
import Node.Encoding (Encoding(..))
import Node.FS.Sync (readTextFile)

readLines :: String -> Effect (Array String)
readLines filename = do
  contents <- readTextFile UTF8 filename
  pure $ split (Pattern "\n") contents

readChars :: String -> Effect (Array String)
readChars filename = do
  contents <- readTextFile UTF8 filename
  pure $ split (Pattern "") contents
