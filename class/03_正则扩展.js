{
    // #构造函数#
    let regex = new RegExp('xyz', 'i'); //第一个参数是字符串，第二个是修饰符
    let regex2 = new RegExp(/xyz/i); //第一个参数是正则表达式，不接受第二个参数，否则会报错
    console.log(regex.test('xyZ123'), regex2.test('xyZ123'));

    let regex3 = new RegExp(/abc/ig, 'i');
    console.log(regex3.flags); // i  原有正则对象的修饰符是ig，它会被第二个参数i覆盖

}

// 字符串对象的4个使用正则表达式的方法： match(),replace(),search(),split()这四个方法全部调用RegExp的实例的方法。

{
    let regex = new RegExp('xyz', 'ig');
    console.log(regex.test('xyz0XYZ1xyz2'), regex.exec('xyz0XYZ1xyz2'));
}

{
    // y修饰符 后一次匹配都从上一次匹配成功的下一个位置开始
    let s = 'bbbb_bbb_bb_b';
    var a1 = /b+/g;
    var a2 = /b+/y;
    //由于g修饰没有位置要求，所以第二次执行会返回结果，而y修饰符要求匹配必须从头部开始，所以返回null。
    console.log(a1.exec(s), a2.exec(s)); // ["bbbb"],["bbbb"]
    console.log(a1.exec(s), a2.exec(s)); // ["bbb"],null

    console.log(a1.sticky, a2.sticky); // false true 表示是否开启了粘连模式

    var s = 'aaa_aa_a';
    var r = /a+_/y;
    r.exec(s); // ["aaa_"]
    r.exec(s); // ["aa_"]
    //上面代码每次匹配，都是从剩余字符串的头部开始。

    //flags 属性
    // ES5 的 source 属性
    // 返回正则表达式的正文
    // /abc/ig.source
    // "abc"
    // ES6 的 flags 属性
    // 返回正则表达式的修饰符
    // /abc/ig.flags
    // 'gi'
}

{
    // u 修饰符作用 匹配大于2个字节的字符 加u修饰符 .不能匹配大于2个字节的字符 同样加u
    console.log('u修饰符', /^\uD83D/.test('\uD83D\uDC2A')); // true
    console.log('u修饰符', /^\uD83D/u.test('\uD83D\uDC2A')); // false
    // 大括号表示Unicode字符，只有加上u才能识别
    console.log(/\u{61}/.test('a')); // false
    console.log(/\u{61}/u.test('a')); // true
    console.log(/\u{20BB7}/u.test('𠮷')); // true
    // 点（.）字符不能识别码点大于0xFFFF的Unicode字符，必须加上u修饰符。
    let s = '𠮷';
    console.log('大于0xFFFF的Unicode字符', /^.$/.test(s)); // false
    console.log('使用u字符', /^.$/u.test(s)); // true

    // 使用u修饰符后，所有量词都会正确识别大于码点大于0xFFFF的Unicode字符。
    console.log('量词', /a{2}/.test('aa')); // true
    console.log('量词', /a{2}/u.test('aa')); // true
    console.log('量词', /𠮷{2}/.test('𠮷𠮷')); // false
    console.log('量词', /𠮷{2}/u.test('𠮷𠮷')); // true
}

{
    // #正则表达式中，点（.）是一个特殊字符，代表任意的单个字符，但是行终止符（line terminator character）除外
    // U+000A 换行符（\n）
    // U+000D 回车符（\r）
    // U+2028 行分隔符（line separator）
    // U+2029 段分隔符（paragraph separator）
    // 只是一个提案目前还不支持
    // let reg=/test.go/s;
    // console.log(reg.test('test\ngo'));
    // console.log(reg.test('test\ngo'));
    console.log('s变通方法', /foo.bar/.test('foo\nbar'));
    console.log('s变通方法', /foo[^]bar/.test('foo\nbar'));
}