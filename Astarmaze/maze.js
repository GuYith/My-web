

var num=15;
var chess = document.getElementById("mycanvas");
var context = chess.getContext('2d');      //渲染2D图像
var tree=[];        //树
var islink=[];      //连通表  
var value=[];       //树结点的大小


function block(n)   //定义block类 n为编号
{
    this.m=n;
    this.x=parseInt(n/num);
    this.y=n%num;
    this.F=0;
    this.G=0;
    this.H=0;
    this.parent=null;
}
//以（25,25）为左上点
function drawChessBoard()//绘画
    {
        for(var i=0;i<num+1;i++)
        {
            context.strokeStyle='gray';//灰色画笔   可选区域
            context.moveTo(25+i*30,25);//垂直方向画15根线，相距30px;
            context.lineTo(25+i*30,25+30*num);
            context.stroke();
            context.moveTo(25,25+i*30);//水平方向画15根线，相距30px;棋盘为14*14；
            context.lineTo(25+30*num,25+i*30);
            context.stroke();
        }
        drawRect(29,29,20,20,'blue');
        drawRect(450,450,20,20,'#ff4433');
      
    }

function drawRect(x,y,width,height,color)
{
    context.fillStyle=color;
    context.fillRect(x,y,width,height);
}


function getnei(n)//获得邻居号  random
    {
        var a= new block(n);
        var x=a.x;//要精确成整数（首先是JavaScipt中变量无Int、float类型之分
        var y=a.y;         //a/num为小数
        var mynei=new Array();//储存邻居编号（还原）
        if(x-1>=0){mynei.push((x-1)*num+y);}//上节点
        if(x+1<15){mynei.push((x+1)*num+y);}//下节点
        if(y+1<15){mynei.push(x*num+y+1);}//有节点
        if(y-1>=0){mynei.push(x*num+y-1);}//下节点
        var ran=parseInt(Math.random() * mynei.length );//Math.random()返回0-1之间的数
        return mynei[ran];      //返回一个随机的邻居

    }


//n为当前节点编号
//tree[][]中存的是该节点的双亲节点
//     递归算法
//     getRoot(n)返回根节点编号
//     n为根节点时返回n
//     n为子节点是，返回getRoot(n的双亲)
function getRoot(n)
{
    var a= new block(n);
    if(tree[a.x][a.y]>0)//大于0是为子节点     根节点n的tree[][]=0
    {
        return getRoot(tree[a.x][a.y]);
    }
    else
        return n;
}
//计算树的大小      均为从根节点开始到树结束的H
function getvalue(n)
{
    var a= new block(n);
    if(tree[a.x][a.y]>0)//为子树时
    {
        return value[a.x][a.y]=getvalue(tree[a.x][a.y]);
       
    }
    else return value[a.x][a.y];
    
}
//合并两个树
//union(a,b)合并两树
//首先是当a,b为根节点时，置m并到n树上，n.value+=m.value
//m.tree[][]置为n
//若a,b不为根节点时，找到根节点
//  小树成为大树的子树
function union(n,m)         //合并某两个点即将其根节点union
{
    var nRoot=getRoot(n);
    var mRoot=getRoot(m);
    var a= new block(n);
    var b= new block(m);
    var aR= new block(nRoot);
    var bR= new block(mRoot);
   if(nRoot==mRoot)
   {

   }
   
   else 
   {
       if(getvalue(nRoot)>=getvalue(mRoot))  //将mRoot的加到nRoot树上
       {
        value[a.x][a.y]+=value[b.x][b.y];
        tree[bR.x][bR.y]=nRoot;
       }
       else                                 //将nRoot的加到mRoot树上
       {
        value[b.x][b.y]+=value[a.x][a.y];
        tree[aR.x][aR.y]=mRoot;
       }
    
   }

}

function drawline(n,m)
{
    var a= new block(n);
    var b= new block(m);
    var x=(a.x+b.x)/2;
    var y=(a.y+b.y)/2;
    
    //左右方向
    if(a.x-b.x==1||a.x-b.x==-1)
    {
        context.strokeStyle='white';
        context.fillStyle='white';
        context.fillRect(x*30+39,y*30+26,2,28);
    }
    else//上下方向
    {
        context.strokeStyle='white';
        context.fillStyle='white';
        context.fillRect(x*30+26,y*30+39,28,2);
    }
}
function clearCanvas()      //清空地图
{
    var chess = document.getElementById("mycanvas");
    var context = chess.getContext('2d'); 
    chess.height=chess.height;  
    chess.width=chess.width;  
}
function linkedToFirst()
{
    for(var i=0;i<num*num-1;i++)
    {
        if(getRoot(0)!=getRoot(i))
            return false;
    }
     return true;
}
function drawPathRect(x,y)
{
    context.fillStyle="rgba(333,255,0,0.6)";
    context.fillRect(x,y,30,30);
}
function drawOpenRect(x,y)
{
    context.fillStyle="rgba(11,255,33,0.2)";
    context.fillRect(x,y,30,30);
}

/**************************************
 * Astar算法
 * *************************************/
var open=new LinkList();
var close=new LinkList();
var cost =10;
//进open表的为block

//计算结点nblk的G
function calcG(nblk)
{
    var curblk=nblk;
    var extraG=cost;
    var parentG=getRoot(curblk.m)==-1?0:curblk.parent.G;
    return extraG+parentG;
}
//将与end的欧氏距离作为结点nblk的H
//且满足H<H*
function calcH(nblk,end)
{
    var curblk=nblk;
    var e=end;
    return Math.sqrt((e.x-curblk.x)*(e.x-curblk.x)+(e.y-curblk.y)*(e.y-curblk.y));
}

//F=G+H  
function calcF(nblk)
{
    var curblk=nblk;
    return curblk.G+curblk.H;
}
//返回block n的可遍历的所有邻居的编号链表
function getsurroudblocks(n)
{
    var surroundBlock=new LinkList();
    x=n.x;
    y=n.y;
    if(y-1>=0)
    {
        var m=new block(x*num+y-1);
        if(isCanReach(n,m))
        {
        m.parent=n;
        surroundBlock.insert(m);
        }
    }//上节点
    if(y+1<15)
    {
        var m=new block(x*num+y+1);
        if(isCanReach(n,m))
        {
            m.parent=n;
            surroundBlock.insert(m);
        }
            
    }//下节点
    if(x+1<15)
    {
        var m=new block((x+1)*num+y);
        if(isCanReach(n,m))
        {
        m.parent=n;
        surroundBlock.insert(m);
        }

    }//右节点
    if(x-1>=0)
    {
        var m=new block((x-1)*num+y);
        if(isCanReach(n,m))
        {
        m.parent=n;
        surroundBlock.insert(m);
        }
    }//左节点
    return surroundBlock;
}

//返回F最小的block
function getLeastFBlock()
{
    if(!open.isEmpty())
    {
        var resBlock=open.head.next.element;
        for(var i=0;i<open.length;i++)
        {
            var curiBlock=open.findNumNode(i);
            if(curiBlock.F < resBlock.F)
                resBlock=curiBlock;
            return resBlock;
        }
        return null;
    }
}
//判断nblock是否在open表里
function isInlist(open,nblock)
{
    if(open.length==0)
    {
        return null;
    }
    else
    {
        for(var i=0;i<open.length;i++)
        {
            var iblk=open.findNumNode(i);
            if(nblock.x==iblk.x && nblock.y==iblk.y)
            {
                return open;
            }
        }
        return null;
    }
    
}

function isCanReach(curblk,target)
{
    if(islink[curblk.m][target.m]==0||isInlist(close,target)||curblk==target)
        return false;
    else
        return true;
}

function returnPath(find,end)
{
    if(!find)
        return false;
    else
    {
        curblk=end;
        while(curblk!=null)
        {
            drawPathRect(25+30*curblk.x,25+30*curblk.y);
            var m=curblk.parent;

            curblk=m;
            
        }
    }
}
//start end 为block
function findPath(start,end)
{
    open.clear();
    close.clear();
    open.insert(start);     //首先将起点加入open表
    drawOpenRect(25,25);
    while(!open.isEmpty()&&!isInlist(open,end))  //若为空，结束遍历
    {
        var curblk=getLeastFBlock();    //curblk为open表中F值最小的结点
        var surround=getsurroudblocks(curblk);//Block类型  得到curblk的邻居结点表
        open.remove(curblk);    //将curblk移出遍历表（因为已遍历结束）
        close.insert(curblk);   //将curblk加入close表
        curblk.F=0;
        curblk.H=0;
        curblk.G=0;
        for(var i=0;i<surround.length;i++) //依次遍历surround中的所有结点（Block类型）
        {
            var target=surround.findNumNode(i); //设置本次的目标target
        
            if(isInlist(open,target)==null)    //如果target不在open表中
            {
                target.parent=curblk;       //完成初始化
                target.G=calcG(target);       
                target.H=calcH(target,end);
                target.F=calcF(target);
                open.insert(target);    // 加入open表
                drawOpenRect(25+target.x*30,25+target.y*30);
            }
            else//若target在open中则
            {
                var tempG=calcG(target);//重新计算G值
                if(tempG<target.G)//若重新计算后G要小则更新
                {
                    target.parent = curblk;//修改指针
					target.G = tempG;
					target.F = calcF(target);
                }
            }
            var resBlock=isInlist(open,end);//如果end在open表中则返回resBlock（即当前的open表）,算法结束
            if(target.m===224)
            {
                end.parent=curblk;
                return resBlock;
            }
               
        }    
    }
    return null;
}
function aStar()
{
    
    var find=findPath(start,end);
    returnPath(find,end);

}
/***********************/


//getRoot(0)!=getRoot(num*num-1)为迷宫生成的标志
//改为如下是为了消除封闭方格

function proMaze()
{
     for(var i=0;i<num;i++)
{
    tree[i]=[];
    for(var j=0;j<num;j++)
    {
        tree[i][j]=-1;
    }
}
for(var i=0;i<num;i++)
{
    value[i]=[];
    for(var j=0;j<num;j++)
    {
        value[i][j]=1;
    }
}
for(var i=0;i<num*num;i++)
{
    islink[i]=[];
    for(var j=0;j<num*num;j++)
    {
        islink[i][j]=0;
    }
}

    drawChessBoard();
    
    while(linkedToFirst()==0)
    {
        var n = parseInt(Math.random() * num*num );//产生一个小于196的随机数
        var neighbor=getnei(n);
        if(getRoot(n)==getRoot(neighbor)){continue;}
        else//不在一个上
        {
           islink[n][neighbor]=1;islink[neighbor][n]=1;
            drawline(n,neighbor);//划线
            union(n,neighbor);     
        }
    }
}
proMaze();   

var start=new block(0);
var end=new block(224);



