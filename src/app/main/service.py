from flask_socketio import join_room
from app import mongo, db
from app.utils import serialize
import logging, datetime, uuid, time

logger = logging.getLogger(__name__)

class ChatService(object):
    
    @staticmethod
    def getUser(userId):
        logger.info('getUser start')
        result = ()
        try:
            engine = db.get_engine()
            conn = engine.connect()
            sql = "select userId id, userName name, photo avatar from vw_user where userId = %(userId)s and status != 'D'"
            rs = conn.execute(sql, {'userId':userId})
            result = rs.fetchall()
            result = [dict(row.items()) for row in result]
        except Exception as e:
            logger.error("getUser fail")
            logger.error(e)
        logger.info(result)
        return result[0]

    @staticmethod
    def getContacts(userId):
        logger.info('getContacts start')
        result = []
        try:
            result = list(mongo.db.contacts.find({"user": userId}))
            if not result:
                engine = db.get_engine()
                conn = engine.connect()
                sql = "\
select 'friend' type, userId id, userName name, photo avatar from vw_user where deptId = (select deptId from vw_user x where x.userId = %(userId)s) and status != 'D' and userId != %(userId)s \
union \
select 'group' type, deptId id, deptName name, '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' avatar from vw_user where userId = %(userId)s"
                rs = conn.execute(sql, {'userId':userId})
                result = rs.fetchall()
                result = [dict(row.items()) for row in result]
                
                sql = "select count(userId) count from user where deptId = (select deptId from user x where x.userId = %(userId)s) and status != 'D' and app = 'SYS'"
                rs = conn.execute(sql, {'userId':userId})
                count = rs.fetchone()
                count = count[0]
                
                for row in result:
                    if row['type'] == 'friend':
                        contact = mongo.db.contacts.find_one({"user": row['id'], "id": userId}, {"room":1})
                    else:
                        contact = mongo.db.contacts.find_one({"id": row['id']}, {"room":1})
                    
                    row['room'] = contact['room'] if contact else str(uuid.uuid1())
                    row['user'] = userId

                    if row['type'] == 'group':
                        row['members_count'] = count

                if result:
                    mongo.db.contacts.insert_many(result) 

        except Exception as e:
            logger.error("getContacts fail")
            logger.error(e)
        logger.info(result)
        return result

    @staticmethod
    def getRooms(userId):
        logger.info('getRooms start')
        result = []
        try:
            result = list(mongo.db.rooms.find({"user": userId}).sort([("last_modified", -1)]))
            for row in result:
                contact = row['contact']
                contact = mongo.db.contacts.find_one({"user": userId, "id": contact}, {"members_count":1})
                row['name'] = '%s (%s)' % (row['name'], contact['members_count']) if 'members_count' in contact else row['name']
        except Exception as e:
            logger.error("getRooms fail")
            logger.error(e)
        logger.info(result)
        return result

    @staticmethod
    def getRoom(roomId, userId):
        logger.info('getRoom start')
        result = ()
        try:
            result = mongo.db.rooms.find_one({"user": userId, "id": roomId})
            contact = result['contact']
            contact = mongo.db.contacts.find_one({"user": userId, "id": contact}, {"members_count":1})
            result['name'] = '%s (%s)' % (result['name'], contact['members_count']) if 'members_count' in contact else result['name']
        except Exception as e:
            logger.error("getRoom fail")
            logger.error(e)
        logger.info(result)
        return result

    @staticmethod
    def addRoom(userId, contactId, contactName, lastMessage = None):
        logger.info('addRoom start')
        result = None
        try:
            result = mongo.db.rooms.find_one({"user": userId, "contact": contactId}, {"user":1, "id":1, "name":1, "contact":1, "avatar":1, "last_message":1, "last_modified":1, "_id":0})
            if result == None:
                result = mongo.db.contacts.find_one({"user": userId, "id": contactId}, {"room":1, "avatar":1, "_id":0})
                id = result['room']
                avatar = result['avatar']
                result = {
                    "user": userId,
                    "id": id,
                    "name": contactName,
                    "contact": contactId,
                    "avatar": avatar,
                    "last_message": lastMessage or "",
                    "last_modified": datetime.datetime.now()
                }
                mongo.db.rooms.insert_one(result)
            
        except Exception as e:
            logger.error("addRoom fail")
            logger.error(e)
        logger.info(result)
        return result

    @staticmethod
    def getMessages(roomId, limit = 20):
        logger.info('getMessages start')
        result = []
        try:
            result = list(mongo.db.messages.find({"room": roomId}).sort("last_modified").limit(limit))
        except Exception as e:
            logger.error("getMessages fail")
            logger.error(e)
        logger.info(result)
        return result

    @staticmethod
    def addMessage(roomId, user, content):
        logger.info('addMessage start')
        result = None
        try:
            now = datetime.datetime.now()
            data = {
                "room": roomId, 
                "from": user, 
                "type": "text/plain", 
                "content": content, 
                "last_modified": now
            }
            inserted_id = mongo.db.messages.insert_one(data).inserted_id
            mongo.db.rooms.update_one({"id": roomId}, {"$set": {"last_message": content, "last_modified": now}})
            result = data
            result["last_modified"] = int((time.mktime(now.timetuple()) + now.microsecond/1000000.0)*1000)
        except Exception as e:
            logger.error("addMessage fail")
            logger.error(e)
        logger.info(result)
        return result
 
