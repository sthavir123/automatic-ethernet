from lxml import etree as ET
import json

def get_parsed_tree(arxml):
    tree = ET.parse(arxml)
    print(tree)
    # tree=ET.parse(r'C:\Users\tmadni\OneDrive - JAGUAR LAND ROVER\Desktop\Arxml Parser\test.arxml')
    master_root = tree.getroot()
    try:
        node_prefix=master_root.tag.split('}',1)[0]+'}'
    except:
        node_prefix=''
    root_dict={}

    SystemSignal_dict={} # {SystemSignal_node:desc}
    ISignal_dict={}

    ISignalToIPduMaping_dict={}
    ISignalIPdu_dict={}
    ISignalIPduGroup_dict={}
    Common_node_dict={}
    #{path:[[dest,node],[dest,node]]}

    dict_node_all={}
    dict_node={}

    # path_str=ECUSystem/CCCM/CCCM_VAL
    def dfs(parent_node,parent_path,dest,path_str):

        curr_short_name='' # ECUSystem or CCCM or CCCM_VAL to compare
        if '/' in path_str:
            curr_short_name=path_str.split('/',1)[0]
            
        else:
            curr_short_name=path_str
        curr_path_str=path_str

        for child in parent_node:
            if ET.QName(child.tag).localname=='SHORT-NAME':
                shortname_found=False 
            #----------corner case for CCCM/CCCM while calling from getnode----------           
                if parent_path in root_dict: 

                    for val in root_dict[parent_path]: #val:[dest,node]
                        if val[0]==ET.QName(parent_node.tag).localname and val[1]==parent_node:
                            shortname_found=True
                            break
                if shortname_found:
                        continue
            #----------------------------------------------------------------------------
                if parent_path=='':
                    parent_path=child.text
                else:
                    parent_path=parent_path+'/'+child.text
                # parent_path=parent_path+'/'+child.text
                dest_par=ET.QName(parent_node.tag).localname
                try:
                    if [dest_par,parent_node] not in root_dict[parent_path]:
                        root_dict[parent_path].append([dest_par,parent_node])
                except:
                    root_dict.update({parent_path:[[dest_par,parent_node]]})

                if child.text==curr_short_name:

                    if '/' in curr_path_str:
                        curr_path_str=curr_path_str.split('/',1)[1]
                        curr_short_name=curr_path_str.split('/',1)[0]
                        continue

                    else:
                        #final path reached
                        if dest==dest_par:
                            #final dest reached
                            return parent_node
                        else:
                            return None
                else:
                    # redundant path as shortname != curr_short_name
                    return None

            else:
                dfs_status=dfs(parent_node=child,parent_path=parent_path,dest=dest,path_str=curr_path_str)
                if dfs_status:
                    return dfs_status
        return None
                
    def getnode(path,dest):
        path_in_dict=False
        if path in root_dict:
            path_in_dict=True
            for val in root_dict[path]: # val=[dest,node]
                if dest ==val[0]:
                    node_result=val[1]
                    return node_result 
        
        # path with given dest not found

        path_to_loook=''

        #------------------------------------------------------------------------------------------------

        if path_in_dict:
            if '/' not in path:
                path=''
            else:
                path_to_loook=path.rsplit('/',1)[1] # need to look last tag
                path=path.rsplit('/',1)[0]  # since ECUSystem/CCCM/CCCM_VAL with dest=dest not found therefore need to look for dest in parent node    
        #------------------------------------------------------------------------------------------------
        path_array=path.split('/',-1) #path=a/b/c, path_array=[a,b,c]
        current_path=''
        i=0
        result_node=master_root


        while i<len(path_array):
            if current_path=='':
                current_path=path_array[i]
            else:
                current_path=current_path+'/'+path_array[i]
            if current_path in root_dict:
                # result_node_list=root_dict[current_path]
                i+=1
            else:
                if '/' not in current_path:
                    current_path=''
                else:
                    current_path=current_path.rsplit('/',1)[0]
                break

        
        j=i
        if j<len(path_array): # if j=len(path_array) means path in dict must be True
            path_to_loook=path_array[j]
            j+=1
            while j<len(path_array):
                path_to_loook=path_to_loook+'/'+path_array[j]
                j+=1
        
        while(i>0):     
            

            for result_val in root_dict[current_path]:
                result_node=result_val[1]

                node_to_return=dfs(parent_node=result_node,parent_path=current_path,dest=dest,path_str=path_to_loook)
                if node_to_return:
                    return node_to_return
            if i>1:
                path_to_loook=current_path.rsplit('/',1)[1]+'/'+path_to_loook
                current_path=current_path.rsplit('/',1)[0]
            i-=1
        if i==0:
            path_to_loook=path
            return dfs(parent_node=result_node,parent_path=current_path,dest=dest,path_str=path_to_loook)

        return None

    def get_node_of_tag(node,node_path,tag):
        queue=[[node,node_path]]
        first_short_name=True
        result=[]
        while(len(queue)>0):
            curr_val=queue.pop(0)
            curr_node=curr_val[0]
            curr_path=curr_val[1]
            curr_dest=ET.QName(curr_node.tag).localname
            for child in curr_node:
                child_tag=ET.QName(child.tag).localname
                if child_tag=='SHORT-NAME':
                    if first_short_name:
                        first_short_name=False
                        continue   

                    else:
                        if curr_path=='':
                            curr_path=child.text
                        else:
                            curr_path=curr_path+'/'+child.text

                        try:
                            if [curr_dest,curr_node] not in root_dict[curr_path]:
                                root_dict[curr_path].append([curr_dest,curr_node])
                        except:
                            root_dict.update({curr_path:[[curr_dest,curr_node]]})
                if child_tag==tag:
                    next_child_list=child.getchildren()
                    if len(next_child_list)>0 and ET.QName(next_child_list[0].tag)=='SHORT-NAME':
                        child_path=''
                        if curr_path=='':
                            child_path=next_child_list[0].text
                        else:
                            child_path=curr_path+'/'+next_child_list[0].text
                        
                        try:
                            if [child_tag,child_path] not in root_dict[child_path]:
                                root_dict[child_path].append([child_tag,child])
                        except:
                            root_dict.update({child_path:[[child_tag,child]]})
                        
                    if child not in result:
                        result.append(child)
                        
                        
                queue.append([child,curr_path])
        return result

    def get_root_from_path(node,tag_list=[]):
        for child in node:
            if ET.QName(child.tag).localname=='SHORT-NAME':
                continue
            if ET.QName(child.tag).localname in tag_list:
                
                path=child.text.split('/',1)[1]
                dest=child.attrib['DEST']
                
                return getnode(path=path,dest=dest)
                # return dfs(parent_node=master_root,parent_path='',dest=dest,path_str=path)

    def get_list_of_child(node,tag_list=[]):
        for child in node:
            if ET.QName(child.tag).localname=='SHORT-NAME':
                continue
            if ET.QName(child.tag).localname in tag_list:
                return child.getchildren()
        return None

    def Get_SystemSignal_Description(root):
        dict_val={}
        for child in root:
            tag=ET.QName(child.tag).localname
            if tag=='SHORT-NAME':
                dict_val.update({tag:child.text})
                
            if tag=='DESC':
                child_1=child.getchildren()[0]
                dict_val.update({tag:child_1.text})
        return dict_val        
    #5

    def get_node_values_all(node,tag_to_consider=['All'],tag_to_ignore=[]):

        dict_val={}
        queue=[]
        queue.append(node)
        first_node=True
        while(len(queue)>0):
            curr_node=queue.pop(0)
            curr_dict={}
            for child in curr_node:
                tag=ET.QName(child.tag).localname  
                if tag in tag_to_ignore:
                    continue          
                if 'DEST' in child.attrib and (tag in tag_to_consider or tag_to_consider[0]=='All'):
                    dest_child=child.attrib['DEST']
                    path_child=child.text.split('/',1)[1]
                    result_dict={}
                    node_child=getnode(path=path_child,dest=dest_child)
                    if node_child in Common_node_dict:
                        result_dict=Common_node_dict[node_child]
                    else:
                        # print(f'node_child: {node_child}')                    
                        result_dict=get_node_values_all(node=node_child,tag_to_consider=['All'])
                        Common_node_dict.update({node_child:result_dict})
                    # print(result_dict)
                    if tag in curr_dict:                    
                        try:
                            curr_dict[tag].append(result_dict)
                        except:
                            curr_dict[tag]=[curr_dict[tag]] # if multiple then it should be list
                            curr_dict[tag].append(result_dict)
                    else:
                        curr_dict.update({tag:result_dict})

                elif child.text and " " not in child.text and (tag in tag_to_consider or tag_to_consider[0]=='All'):
                    # print(f'{child}: {child.text}')
                    if tag in curr_dict:                    
                        try:
                            curr_dict[tag].append(child.text)
                        except:
                            curr_dict[tag]=[curr_dict[tag]] # if multiple then it should be list
                            curr_dict[tag].append(child.text)
                    else:
                        curr_dict.update({tag:child.text})
                queue.append(child)
            if first_node:
                dict_val=curr_dict
                first_node=False
            elif len(curr_dict)>0:

                curr_node_tag=ET.QName(curr_node.tag).localname
                if curr_node_tag in dict_val:
                    try:
                        dict_val[curr_node_tag].append(curr_dict)
                    except:
                        dict_val[curr_node_tag]=[dict_val[curr_node_tag]]
                        dict_val[curr_node_tag].append(curr_dict)
                else:
                    dict_val.update({curr_node_tag:curr_dict})


            first_node=False
        return(dict_val)

    def get_node_values(node,tag_to_consider=['All']):
        dict_val={}
        for child in node:
            tag=ET.QName(child.tag).localname
            if tag=='SHORT-NAME':
                dict_val.update({tag:child.text})
                dict_val.update({"label":child.text})
                continue
            if child.text and " " not in child.text and (tag in tag_to_consider or tag_to_consider[0]=='All'):
                dict_val.update({tag:child.text})
        return dict_val

    def get_SystemSignal_fromISignalIPdu_list(ISignalIPdu_list):
        
        for ISignalIPdu in ISignalIPdu_list:

            ISignalIPdu_val=get_node_values_all(node=ISignalIPdu,tag_to_consider=['All'],tag_to_ignore=['I-SIGNAL-IN-I-PDU-REF'])
            ISignalIPdu_dict.update({ISignalIPdu:ISignalIPdu_val})

        
    #7

    # -----------modified
    path_val='ECUSystem/CCCM'
    dest_val="AR-PACKAGE"


    ECU_node=getnode(path=path_val,dest=dest_val)
    # CommControllers_node=get_first_node_from_tag(node=ECU_node,tag='COMM-CONTROLLERS')
    Ecu_Instance_node_list=ECU_node.findall(f'.//{node_prefix}ECU-INSTANCE')

    def add_value_to_dict(key,dict_val,val):
        res_dict=dict_val
        if key in res_dict:                    
            try:
                res_dict[key].append(val)
            except:
                res_dict[key]=[res_dict[key]] # if multiple then it should be list
                res_dict[key].append(val)
        else:
            res_dict.update({key:val})
        return res_dict

    def get_node_values_all(node,tag_to_consider=['All'],tag_to_ignore=[]):

        dict_val={}
        queue=[]
        queue.append(node)
        first_node=True
        while(len(queue)>0):
            curr_node=queue.pop(0)
            curr_dict={}
            for child in curr_node:
                tag=ET.QName(child.tag).localname  
                if tag in tag_to_ignore:
                    continue          
                if 'DEST' in child.attrib and (tag in tag_to_consider or tag_to_consider[0]=='All'):
                    dest_child=child.attrib['DEST']
                    path_child=child.text.split('/',1)[1]
                    result_dict={}
                    node_child=getnode(path=path_child,dest=dest_child)
                    if node_child in Common_node_dict:
                        result_dict=Common_node_dict[node_child]
                    else:
                        # print(f'node_child: {node_child}')                    
                        result_dict=get_node_values_all(node=node_child,tag_to_consider=['All'])
                        Common_node_dict.update({node_child:result_dict})
                    # print(result_dict)
                    if tag in curr_dict:                    
                        try:
                            curr_dict[tag].append(result_dict)
                        except:
                            curr_dict[tag]=[curr_dict[tag]] # if multiple then it should be list
                            curr_dict[tag].append(result_dict)
                    else:
                        curr_dict.update({tag:result_dict})

                elif child.text and " " not in child.text and (tag in tag_to_consider or tag_to_consider[0]=='All'):
                    # print(f'{child}: {child.text}')
                    if tag in curr_dict:                    
                        try:
                            curr_dict[tag].append(child.text)
                        except:
                            curr_dict[tag]=[curr_dict[tag]] # if multiple then it should be list
                            curr_dict[tag].append(child.text)
                    else:
                        curr_dict.update({tag:child.text})
                queue.append(child)
            if first_node:
                dict_val=curr_dict
                first_node=False
            elif len(curr_dict)>0:

                curr_node_tag=ET.QName(curr_node.tag).localname
                if curr_node_tag in dict_val:
                    try:
                        dict_val[curr_node_tag].append(curr_dict)
                    except:
                        dict_val[curr_node_tag]=[dict_val[curr_node_tag]]
                        dict_val[curr_node_tag].append(curr_dict)
                else:
                    dict_val.update({curr_node_tag:curr_dict})


            first_node=False
        return(dict_val)

    node_lists=[]

    def get_node_values_all_new(node,tag_to_consider=['All'],tag_to_ignore=[]):

        dict_val={}
        queue=[]
        queue.append(node)
        first_node=True
        while(len(queue)>0):
            curr_node=queue.pop(0)
            curr_dict={}
            for child in curr_node:
                tag=ET.QName(child.tag).localname  
                if tag in tag_to_ignore:
                    continue          
                if 'DEST' in child.attrib and (tag in tag_to_consider or tag_to_consider[0]=='All'):
                    dest_child=child.attrib['DEST']
                    path_child=child.text.split('/',1)[1]
                    result_dict={}
                    node_child=getnode(path=path_child,dest=dest_child)
                    if node_child in Common_node_dict:
                        result_dict=Common_node_dict[node_child]
                    else:
                        # print(f'node_child: {node_child}')                    
                        # result_dict=get_node_values_all(node=node_child,tag_to_consider=['All'])
                        result_dict=[node_child] # important to add as array
                        Common_node_dict.update({node_child:result_dict})

                        if result_dict not in node_lists:
                            node_lists.append(result_dict)

                    # print(result_dict)
                    curr_dict=add_value_to_dict(key=tag,dict_val=curr_dict,val=result_dict)

                elif child.text and " " not in child.text and (tag in tag_to_consider or tag_to_consider[0]=='All'):
                    # print(f'{child}: {child.text}')
                    curr_dict=add_value_to_dict(key=tag,dict_val=curr_dict,val=child.text)

                queue.append(child)       
                    


            if first_node:
                dict_val=curr_dict
                first_node=False
            elif len(curr_dict)>0:

                curr_node_tag=ET.QName(curr_node.tag).localname
                dict_val=add_value_to_dict(key=curr_node_tag,dict_val=dict_val,val=curr_dict)


            first_node=False
        return(dict_val)


    while len(node_lists)>0: #node_lists=[[node1],[node2],[node3]]
        node_list=node_lists.pop(0) # node_list=[node1]
        curr_node=node_list[0]
        print(curr_node)
        if not curr_node:
            # break
            continue    
        result_dict=get_node_values_all_new(node=curr_node)
        print(1)
        node_list.append(result_dict)
        node_list.pop(0)
        # break

    ECU_dict={}
    res={}
    for Ecu_Instance_node in Ecu_Instance_node_list:
        for child in Ecu_Instance_node:
            tag=ET.QName(child.tag).localname
            if tag=='SHORT-NAME':
                ECU_dict.update({tag:child.text})
            elif tag=='COMM-CONTROLLERS':
                res=get_node_values_all_new(node=child)
                
                print(tag)

    node_ISignalIPduGroup=getnode(path=path_val+'/ISignalPduGroup',dest="AR-PACKAGE")
    List_ISignalIPduGroup=get_list_of_child(node_ISignalIPduGroup,tag_list=['ELEMENTS'])
    # debug_root=None
    result={}

    for ISignalIPduGroup in List_ISignalIPduGroup:    

        List_ISignalIPduRefCond=[]
        List_ISignalIPduRefCond=get_list_of_child(node=ISignalIPduGroup,tag_list=['I-SIGNAL-I-PDUS'])
        if not List_ISignalIPduRefCond:
            continue
        ISignalIPdu_list=[]
        for ISignalIPduRefCond in List_ISignalIPduRefCond:
            ISignalIPdu=get_root_from_path(node=ISignalIPduRefCond,tag_list=['I-SIGNAL-I-PDU-REF'])
            ISignalIPdu_list.append(ISignalIPdu)
        
        get_SystemSignal_fromISignalIPdu_list(ISignalIPdu_list)

        ISignalIPduGroup_val=get_node_values(node=ISignalIPduGroup,tag_to_consider=['COMMUNICATION-DIRECTION','COMMUNICATION-MODE'])
        for ISignalIPdu in ISignalIPdu_list:
            try:
                ISignalIPduGroup_val['I-SIGNAL-I-PDUS'].append(ISignalIPdu_dict[ISignalIPdu])
            except:
                ISignalIPduGroup_val.update({'I-SIGNAL-I-PDUS':[ISignalIPdu_dict[ISignalIPdu]]})
        # ISignalIPduGroup_dict.update({ISignalIPduGroup:ISignalIPduGroup_val})
        ISignalIPduGroup_dict.update({str(ISignalIPduGroup):ISignalIPduGroup_val})
        
        # dict_node.update({str(ISignalIPduGroup):ISignalIPduGroup_val})

        # ISignalIPduGroup_val1=get_node_values_all(node=ISignalIPduGroup,
        #                                           tag_to_consider=['All'],
        #                                           tag_to_ignore=['I-SIGNAL-IN-I-PDU-REF','CONTAINED-I-SIGNAL-I-PDU-GROUP-REF'])
        # dict_node_all.update({str(ISignalIPduGroup):ISignalIPduGroup_val1})


    json_object = json.dumps(ISignalIPduGroup_dict, indent=4)
    return json_object


