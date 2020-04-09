from enum import Enum
import uuid, datetime

class Action(Enum):
  JOINED = 0
  LEFT = 1
  RENAME = 2
  