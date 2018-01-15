# jasmine_exercise
Jasmine使用说明书
一、引入文件
测试代码 必须能引用到 需要测试的代码块，也可以直接把 需要测试的代码块 直接写	在测试代码中；
二、基本样式

describe可以嵌套；
每个describe可以有多个it；
每个it可以有多个expect；
三、运行结果
运行html，在浏览器中查看


四、使用方向
1.断言具体值（ 如 expect(1==’1’).toBe(true) ）；
2.spy追踪函数是否调用；
3.追踪spy监听信息；

五、具体项目实例分析
1、例如更改交易密码
对交易密码的校验单独封装一个函数；对这个函数进行测试；


六、参考学习论坛
http://www.cnblogs.com/laixiangran/p/5060922.html
http://www.tuicool.com/articles/bqQnEv
http://www.tuicool.com/articles/biaYB3j

七、测试代码书写原则
1.功能模块化；
2.尽量传参；
3.尽量有返回值；
4.

八、单元测试的基本思路：实际值是否等于自己的预期值；
编写测试代码的基本原则：
1.功能模块化、单一化；
2.调用通过传参；
3.每个功能模块尽量有返回值；
