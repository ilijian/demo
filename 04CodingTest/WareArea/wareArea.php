<!doctype html>
<html lang="zh-cn">
<head>
    <title>����ѯ</title>

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
                    <td width="160">��������</td>
                    <td width="160">�ֿ�ID</td>
                    <td width="160">�ֿ�����</td>
                    <td width="160">����ID</td>
                    <td width="200">��������</td>
                    <td width="200">��������</td>
                    <td width="200">�����Ʒ����</td>
                    <td width="200">��ȫ�������</td>
                    <td width="200">��������</td>
                    <td width="200">״̬</td>
                </tr>
            </thead>
            <tbody id="singlePageList">
            </tbody>
            
        </table>
    </div>
    <div class="l-panel-bar">
        <div class="l-bar-group p-page-other" id="pageStatis">�� 0 ����ÿҳ��ʾ��10</div>
        <div class="l-bar-group p-page-btn" id="pageNavigation"></div>
        <script type="text/template" id="pageStatisTpl">
            �� <%= page.totalRecord %> ����ÿҳ��ʾ��<%= page.pageSize %>
        </script>
    </div>
    <!--�����ĵ�����ʾģ��-->
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
        <td><%if(state == 2){%>ͣ��<%}else{%>����<%} %></td>
        <!--<td><button>����</button></td>-->
    </script>
    <script type="text/template" id="wareHouseItems">
        <%for(var i=0,items=data.list;i<items.length;i++) {%>
          <% var item = items[i] %>
          <option value="<%= item.warehouseCode %>" <%if(item.warehouseType){%>warehouseType=<%=item.warehouseType%><%}%>><%= item.warehouseName %></option>
        <%} %>
    </script>
    <!--����������/�༭ģ��-->
    <script type="text/template" id="wareAreaAdd-template">
        <form id="wareAreaForm" name="wareAreaForm" method="post">
        <div class="wareAreaForm-add-table">
            <table width="550" align="center" border="0" cellspacing="0" cellpadding="0" class="p-table">
                <tr>
                    <td align="right"><span style="color:red">*</span>�������ƣ�</td>
                    <td><label for="textfield"></label> <input type="text" name="wareAreaDTO.institutionName" maxlength="8" value="&#19968;&#21152;&#31185;&#25216;" readonly="readonly" id="institutionName"/></td>
                    <td align="right"><span style="color:red">*</span>�ֿ����ƣ�</td>
                    <td>
                        <select name="wareAreaDTO.warehouseName"  id="warehouseName">
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="right"><span style="color:red">*</span>����ID��</td>
                    <td><input type="text" name="wareAreaDTO.wareAreaCode" id="wareareaCode" <%if(wareareaCode){%>value=<%=wareareaCode%> <%}%>/></td>
                    <td colspan="2">
                        <div id="stateArea">
                            <input type="radio" name="wareAreaDTO.state" id="state1" <%if(state==1 || state == null){%>checked="checked"<%}%> value="1"/>
                            <label for="wareAreaDTO.state1">����</label>
                            <input type="radio" name="wareAreaDTO.state" id="state2" value="2" <%if(state==2){%>checked="checked"<%}%>/>
                            <label for="wareAreaDTO.state2">ͣ��</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="right"><span style="color:red">*</span>�������ƣ�</td>
                    <td colspan="3"><input type="text" name="wareAreaDTO.wareAreaName" id="wareareaName" <%if(wareareaName){%>value=<%=wareareaName%> <%}%> /></td>
                </tr>
                <tr>
                    <td align="right"><span style="color:red">*</span>��������</td>
                    <td colspan="3">
                        <select name="wareAreaDTO.wareareaType" id="wareareaType" style="width:135px">
                            <option value=""></option>
                            <option value="1">�ջ���</option>
                            <option value="2">������</option>
                            <option value="3">�����</option>
                            <option value="4">�ݴ���</option>
                            <option value="5">�ۺ���</option>
                            <option value="6">��Ʒ��</option>
                            <option value="7">������</option>
                            <option value="8">��Ʒ��</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="right">�����Ʒ���ࣺ</td>
                    <td><input type="text" name="wareAreaDTO.goodsType" maxlength="6" id="goodsType" <%if(goodsType){%>value=<%=goodsType%> <%}%> /></td>
                    <td align="right"><span style="color:red">*</span>��ȫ������ã�</td>
                    <td><input type="text" name="wareAreaDTO.safeQuantity" id="safeQuantity" <%if(safeQuantity){%>value=<%=safeQuantity%> <%}%> /></td>
                </tr>
                <tr>
                    <td align="right">�������ͣ�</td>
                    <td>
                        <select name="wareAreaDTO.networkPointType" id="networkPointType" style="width:135px">
                            <option vaule=""></option>
                            <option value="1">���ϲ�</option>
                            <option value="2">���޷��ϲ�</option>
                            <option value="3">�Ǳ��޷��ϲ�</option>
                            <option value="4">���ϲ�����</option>
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
                    value='�ύ'
                    onclick="return checkSubmit();" /> 
                <input id="Button1"
                    class="l-button l-button-reset" type="reset" value="����" /> 
                <input
                    class="l-button" type="button" value="����" onclick="reback()" /></td>
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