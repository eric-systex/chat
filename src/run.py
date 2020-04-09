#!/usr/bin/env python
import logging
import os
from cloghandler import ConcurrentRotatingFileHandler
from app import create_app, socketio

# 基礎設定
log_dir = os.environ.get('LOG_DIR') or '' 

filehandler = ConcurrentRotatingFileHandler('%schat.log' % log_dir, mode='a', maxBytes=5*1024*1024, backupCount=7, encoding='utf-8')
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s %(threadName)s %(name)s:%(lineno)-4d [%(levelname)s] %(message)s',
                    datefmt='%m-%d %H:%M:%S',
                    handlers = [filehandler])
 
logging.getLogger('socketio').setLevel(logging.ERROR)
logging.getLogger('engineio').setLevel(logging.ERROR)

# # 定義 handler 輸出 sys.stderr
# console = logging.StreamHandler()
# console.setLevel(logging.INFO)
# # 設定輸出格式
# formatter = logging.Formatter('%(name)-12s: %(levelname)-8s %(message)s')
# # handler 設定輸出格式
# console.setFormatter(formatter)
# # 加入 hander 到 root logger
# logging.getLogger('').addHandler(console)
 
app = create_app(os.getenv('FLASK_CONFIG') or 'default') 

if __name__ == '__main__': 
    socketio.run(app, host='0.0.0.0')
