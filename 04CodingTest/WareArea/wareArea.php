<!doctype html>
<html lang="zh-cn">
<head>
    <title>库存查询</title>

    <link href="../skins/Aqua/css/wms.css" rel="stylesheet" type="text/css" />
    <script src="../js/lib/jquery-1.9.1.min.js" type="text/javascript"></script>
    <script src="../js/lib/ligerui.all.js" type="text/javascript"></script>
    <script src="../js/lib/underscore-min.js"></script>
    <!--<script src="../js/lib/backbone.js"></script>-->
    <script src="../js/wmsSysManage/backbone.js"></script>
    <script src="../js/common/wms.pager.js"></script>
    <?php include '../head.php'; ?>
</head>
<body class="wms">
    <div id="toptoolbar" ></div>
    <div id="wareareaDiv" style="display:none;" ></div> 

    <div class="in-order-list">
        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" class="p-table">
            <thead>
                <tr class="p-table-header">
                    <td width="50"><input type="checkbox" id="chooseAll"></td>
                    <td width="160">机构名称</td>
                    <td width="160">仓库ID</td>
                    <td width="160">仓库名称</td>
                    <td width="160">库区ID</td>
                    <td width="200">库区名称</td>
                    <td width="200">库区类型</td>
                    <td width="200">存放商品种类</td>
                    <td width="200">安全库存设置</td>
                    <td width="200">网点类型</td>
                    <td width="200">状态</td>
                </tr>
            </thead>
            <tbody id="singlePageList">
            </tbody>
            
        </table>
    </div>
    <div class="l-panel-bar">
        <div class="l-bar-group p-page-other" id="pageStatis">总 0 条。每页显示：10</div>
        <div class="l-bar-group p-page-btn" id="pageNavigation"></div>
        <script type="text/template" id="pageStatisTpl">
            总 <%= page.totalRecord %> 条。每页显示：<%= page.pageSize %>
        </script>
    </div>
    <!--库区的单条显示模板-->
    <script type="text/template" id="item-template">
        <td><input type="checkbox" style="text-align: center" name="del" class="toggle" > </input></td>
        <td><%= institutionName %></td>
        <td><%= warehouseCode %></td>
        <td><%= warehouseName %></td>
        <td><%= wareareaCode %></td>
        <td><%= wareareaName %></td>
        <td><%= wareareaType %></td>
        <td><%= goodsType %></td>
        <td><%= safeQuantity %></td>
        <td><%= networkPointType %></td>
        <td><%if(state == 2){%>停用<%}else{%>启用<%} %></td>
        <!--<td><button>启用</button></td>-->
    </script>
    <script type="text/template" id="wareHouseItems">
        <%for(var i=0,items=data.list;i<items.length;i++) {%>
          <% var item = items[i] %>
          <option value="<%= item.warehouseCode %>" <%if(item.warehouseType){%>warehouseType=<%=item.warehouseType%><%}%>><%= item.warehouseName %></option>
        <%} %>
    </script>
    <!--库区的新增/编辑模板-->
    <script type="text/template" id="wareAreaAdd-template">
        <form id="wareAreaForm" name="wareAreaForm" method="post">
        <div class="wareAreaForm-add-table">
            <table width="550" align="center" border="0" cellspacing="0" cellpadding="0" class="p-table">
                <tr>
                    <td align="right"><span style="color:red">*</span>机构名称：</td>
                    <td><label for="textfield"></label> <input type="text" name="wareAreaDTO.institutionName" maxlength="8" value="&#19968;&#21152;&#31185;&#25216;" readonly="readonly" id="institutionName"/></td>
                    <td align="right"><span style="color:red">*</span>仓库名称：</td>
                    <td>
                        <select name="wareAreaDTO.warehouseName"  id="warehouseName">
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="right"><span style="color:red">*</span>库区ID：</td>
                    <td><input type="text" name="wareAreaDTO.wareAreaCode" id="wareareaCode" <%if(wareareaCode){%>value=<%=wareareaCode%> <%}%>/></td>
                    <td colspan="2">
                        <div id="stateArea">
                            <input type="radio" name="wareAreaDTO.state" id="state1" <%if(state==1 || state == null){%>checked="checked"<%}%> value="1"/>
                            <label for="wareAreaDTO.state1">启用</label>
                            <input type="radio" name="wareAreaDTO.state" id="state2" value="2" <%if(state==2){%>checked="checked"<%}%>/>
                            <label for="wareAreaDTO.state2">停用</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="right"><span style="color:red">*</span>库区名称：</td>
                    <td colspan="3"><input type="text" name="wareAreaDTO.wareAreaName" id="wareareaName" <%if(wareareaName){%>value=<%=wareareaName%> <%}%> /></td>
                </tr>
                <tr>
                    <td align="right"><span style="color:red">*</span>库区类型</td>
                    <td colspan="3">
                        <select name="wareAreaDTO.wareareaType" id="wareareaType" style="width:135px">
                            <option value=""></option>
                            <option value="1">收货区</option>
                            <option value="2">整存区</option>
                            <option value="3">零存区</option>
                            <option value="4">暂存区</option>
                            <option value="5">售后区</option>
                            <option value="6">残品区</option>
                            <option value="7">包材区</option>
                            <option value="8">奖品区</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="right">存放商品种类：</td>
                    <td><input type="text" name="wareAreaDTO.goodsType" maxlength="6" id="goodsType" <%if(goodsType){%>value=<%=goodsType%> <%}%> /></td>
                    <td align="right"><span style="color:red">*</span>安全库存设置：</td>
                    <td><input type="text" name="wareAreaDTO.safeQuantity" id="safeQuantity" <%if(safeQuantity){%>value=<%=safeQuantity%> <%}%> /></td>
                </tr>
                <tr>
                    <td align="right">网点类型：</td>
                    <td>
                        <select name="wareAreaDTO.networkPointType" id="networkPointType" style="width:135px">
                            <option vaule=""></option>
                            <option value="1">好料仓</option>
                            <option value="2">保修废料仓</option>
                            <option value="3">非保修废料仓</option>
                            <option value="4">来料不良仓</option>
                        </select>
                    </td>
                </tr>
            </table>
        </div>
        <table style="display:none" width="500" border="0" align="center" cellpadding="0"
            cellspacing="0" class="p-popform-footer">
            <tr>
                <td align="right">
                <input id="Button1"
                    class="l-button l-button-submit"
                    value='提交'
                    onclick="return checkSubmit();" /> 
                <input id="Button1"
                    class="l-button l-button-reset" type="reset" value="重置" /> 
                <input
                    class="l-button" type="button" value="返回" onclick="reback()" /></td>
            </tr>
        </table>
        </form>
    </script>
    <script>
        require(['wareArea'],function(ac){
          //ac.init();
        });
    </script>
</body>

</html>