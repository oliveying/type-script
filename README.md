### 构建typescript 项目
## Gulp

### 创建简单工程
我们首先创建一个新目录。 命名为 proj，也可以使用任何你喜欢的名字。
```
mkdir proj
cd proj
```
我们将以下面的结构开始我们的工程：
```
proj/
   ├─ src/
   └─ dist/
```
TypeScript文件放在src文件夹下，经过TypeScript编译器编译生成的目标文件放在dist目录下。

下面让我们来创建这些文件夹：
```
mkdir src
mkdir dist
```
### 初始化工程
现在让我们把这个文件夹转换成npm包：
```
npm init
```
你将看到有一些提示操作。 除了入口文件外，其余的都可以使用默认项。 入口文件使用 ./dist/main.js。 你可以随时在 package.json文件里更改生成的配置。

### 安装依赖项
现在我们可以使用npm install命令来安装包。 首先全局安装TypeScript和Gulp。 （如果你正在使用Unix系统，你可能需要使用 sudo命令来启动npm install命令行。）
```
npm install -g gulp-cli
```
然后安装typescript，gulp和gulp-typescript到开发依赖项。 Gulp-typescript是TypeScript的一个Gulp插件。
```
npm install --save-dev typescript gulp gulp-typescript
```
写一个简单的例子
让我们写一个Hello World程序。 在 src目录下创建main.ts文件：
```JS
function hello(compiler: string) {
    console.log(`Hello from ${compiler}`);
}
hello("TypeScript");
```
在工程的根目录proj下新建一个tsconfig.json文件：
```JSON

{
    "files": [
        "src/main.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```
### 新建gulpfile.js文件
在工程根目录下，新建一个gulpfile.js文件：
```js
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});
```
### 测试这个应用
```
gulp
node dist/main.js
```
程序应该能够打印出“Hello from TypeScript!”。

### 向代码里添加模块
在使用Browserify前，让我们先构建一下代码然后再添加一些混入的模块。 这个结构将是你在真实应用程序中会用到的。

新建一个src/greet.ts文件：
```ts
export function sayHello(name: string) {
    return `Hello from ${name}`;
}
```
更改src/main.ts代码，从greet.ts导入sayHello：
```ts
import { sayHello } from "./greet";

console.log(sayHello("TypeScript"));
```
最后，将src/greet.ts添加到tsconfig.json：
```json
{
    "files": [
        "src/main.ts",
        "src/greet.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```
确保执行gulp后模块是能工作的，在Node.js下进行测试：
```
gulp
node dist/main.js
```
注意，即使我们使用了ES2015的模块语法，TypeScript还是会生成Node.js使用的CommonJS模块。 我们在这个教程里会一直使用CommonJS模块，但是你可以通过修改 module选项来改变这个行为。

### Browserify
现在，让我们把这个工程由Node.js环境移到浏览器环境里。 因此，我们将把所有模块捆绑成一个JavaScript文件。 所幸，这正是Browserify要做的事情。 更方便的是，它支持Node.js的CommonJS模块，这也正是TypeScript默认生成的类型。 也就是说TypeScript和Node.js的设置不需要改变就可以移植到浏览器里。

首先，安装Browserify，tsify和vinyl-source-stream。 tsify是Browserify的一个插件，就像gulp-typescript一样，它能够访问TypeScript编译器。 vinyl-source-stream会将Browserify的输出文件适配成gulp能够解析的格式，它叫做 vinyl。
```
npm install --save-dev browserify tsify vinyl-source-stream
```
新建一个页面
在src目录下新建一个index.html文件：
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Hello World!</title>
    </head>
    <body>
        <p id="greeting">Loading ...</p>
        <script src="bundle.js"></script>
    </body>
</html>
```
修改main.ts文件来更新这个页面：
```js
import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript");
```
showHello调用sayHello函数更改页面上段落的文字。 现在修改gulpfile文件如下：
```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var paths = {
    pages: ['src/*.html']
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copy-html"], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
});
```

这里增加了copy-html任务并且把它加作default的依赖项。 这样，当 default执行时，copy-html会被首先执行。 我们还修改了 default任务，让它使用tsify插件调用Browserify，而不是gulp-typescript。 方便的是，两者传递相同的参数对象到TypeScript编译器。

调用bundle后，我们使用source（vinyl-source-stream的别名）把输出文件命名为bundle.js。

测试此页面，运行gulp，然后在浏览器里打开dist/index.html。 你应该能在页面上看到“Hello from TypeScript”。

注意，我们为Broswerify指定了debug: true。 这会让 tsify在输出文件里生成source maps。 source maps允许我们在浏览器中直接调试TypeScript源码，而不是在合并后的JavaScript文件上调试。 你要打开调试器并在 main.ts里打一个断点，看看source maps是否能工作。 当你刷新页面时，代码会停在断点处，从而你就能够调试 greet.ts。



## gulp 错误问题解决
**********注意************
如果使用gulp命令时报错
```
AssertionError [ERR_ASSERTION]: Task function must be specified
```

解决方法：
1.先使用 gulp -v 检查gulp版本  查看gulp的Local version版本和package.json里面的版本是否相同
```bash
CLI version: 2.3.0
Local version: 4.0.2
```
如果是版本号相同，是4.0版本编写的代码有误。
把`gulp.task("default", ['copy-html']`
换成 `gulp.task("default",gulp.series("copy-html")`



