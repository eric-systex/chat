import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard to guess string'
    JWT_ACCESS_TOKEN_EXPIRES = False
    TESTING = True if os.environ.get('TESTING') else False

    APPS_DB_HOST = os.environ.get('APPS_DB_HOST') or 'localhost'
    APPS_DB_USER = os.environ.get('APPS_DB_USER') or 'root'
    APPS_DB_PASS = os.environ.get('APPS_DB_PASS') or 'root'
    APPS_DB_NAME = os.environ.get('APPS_DB_NAME') or 'apps'

    MONGO_DB_HOST = os.environ.get('MONGO_DB_HOST') or 'localhost'
    MONGO_DB_USER = os.environ.get('MONGO_DB_USER') or 'chat'
    MONGO_DB_PASS = os.environ.get('MONGO_DB_PASS') or 'chat'
    MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME') or 'chat'

    MONGO_MAX_POOL_SIZE = 10
    MONGO_URI = 'mongodb://%s:%s@%s/%s' % (MONGO_DB_USER, MONGO_DB_PASS, MONGO_DB_HOST, MONGO_DB_NAME)
    
    SQLALCHEMY_POOL_SIZE = 10
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://%s:%s@%s/%s' % (APPS_DB_USER, APPS_DB_PASS, APPS_DB_HOST, APPS_DB_NAME)
    
    @staticmethod
    def init_app(app): 
        pass

class DevelopmentConfig(Config): 
    DEBUG = True

class DockerConfig(Config): 
    DEBUG = True

class KubernetesConfig(Config):
    DEBUG = False

config = {
    'dev': DevelopmentConfig,
    'docker': DockerConfig,
    'kubernetes': KubernetesConfig,
    'default': DevelopmentConfig
}
