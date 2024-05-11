const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
const path = require('path')
const cors = require('koa2-cors')
const multer = require('@koa/multer')
const static = require('koa-static')

const app = new Koa()
const router = new Router()


app.use(serve(path.join(__dirname, './upload')))
app.use(cors())
app.use(router.routes()).use(router.allowedMethods())
const storage = multer.diskStorage({
  destination: function(req,file,cb) {
    cb(null, './upload')
  },
  filename: function(req, file ,cb) {
    let originalname = file.originalname
    let newString = Buffer.from(originalname,"latin1").toString("utf8")
    const fileFormat = (newString).split('.')
    console.log(newString)
    console.log(fileFormat)
    cb(null, fileFormat[0] + '_' + Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})
const upload = multer({storage})
router.get('/', async (ctx) => {
  console.log('host', ctx.request.header['host'])
  console.log('request', ctx.request.header['user-agent'])
  ctx.type = 'html'
  ctx.body = '<h1>hello world!</h1>'
})
app.use(static(
  path.join(__dirname, '/') // 假设HTML文件在public目录下
));
router.post('/upload', upload.single('file'), async(ctx) => {
  console.log('ctx.request.body', ctx.request.body)
  ctx.body = 'done'
})

app.listen(3000, () => {
  console.log('应用已经启动, http://localhost:3000')
})

