from .models import Files
from rest_framework import viewsets
from .serializers import FilesSerializer
import protoparser
import json
from django.http import JsonResponse
import os
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from google.protobuf.descriptor import FieldDescriptor
from .parse import get_parsed_tree
import subprocess
import re



# function to run powershell commands from python 
# modify it for other environments
def run(cmd):
    completed = subprocess.run(["powershell", "-Command", cmd], capture_output=True)
    return completed

#proto parser not able to handle multiline comments so removing comments from the original file
def comment_remover(text):
    def replacer(match):
        s = match.group(0)
        if s.startswith('/'):
            return " " # note: a space and not an empty string
        else:
            return s
    pattern = re.compile(
        r'//.*?$|/\*.*?\*/|\'(?:\\.|[^\\\'])*\'|"(?:\\.|[^\\"])*"',
        re.DOTALL | re.MULTILINE
    )
    return re.sub(pattern, replacer, text)


class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer

# Run the parse function on the specified file and get the parsed
# json object
@csrf_exempt
def arxml_parse(request):
    if request.method == "GET":
        filepath = os.path.join(settings.MEDIA_ROOT, request.GET['file'])
        sample_json = json.loads(get_parsed_tree(filepath).replace("SHORT-NAME","label"))
        return JsonResponse({'data' : sample_json})

#run command to compile .proto files
def compile_proto_files():
    #hard coded command modify it according to your proto-bin path
    command = f"C:\\Users\\smundre\\Downloads\\Proto3\\bin\\protoc -I. --python_out=. .\\temp.proto"
    try:
        subprocess.check_output(command, shell=True)
        print("Proto files compiled successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error compiling proto files: {e}")

#get the file .proto file posted by the frontend store the file as temp.proto
# and compile and parse the file and give the parsed data in response    
@csrf_exempt
def my_view(request):
    
    data = {}
    if request.method == "POST":
        f = request.FILES['file'].open('r')
        u = comment_remover(f.read().decode('utf-8'))
        k = open(os.path.join(settings.BASE_DIR, 'temp.proto'),'w')
        k.write(u)
        k.close()
        
        
        data = json.loads(protoparser.serialize2json(u))
        compile_proto_files()
    return JsonResponse(data)


#Set the message feilds in protofile sent in post and generate encoded payload  
@csrf_exempt
def protopost(request):
    if(request.method == "POST"):
        
        k  = json.loads(request.body.decode('utf8'))
        import temp_pb2
        temp1 = getattr(temp_pb2,k['name'])
        print(k['name'])
        temp_obj = temp1()
        
        attr = k['input']
        
        #hardcoded handling of types for casting string payload to desired type 
        # handled string,int and float out of the 16 specified proto files  
        for (key,val) in attr.items():
            try:
                t = type(getattr(temp_obj,key))
            except:
                continue
            label = temp_obj.DESCRIPTOR.fields_by_name[key].label
            
            if(label==FieldDescriptor.LABEL_REPEATED):
                #handling reeated feilds
                l = val.split(',')
                if(temp_obj.DESCRIPTOR.fields_by_name[key].type==FieldDescriptor.TYPE_STRING):
                    getattr(temp_obj,key)[:] = l
                elif(temp_obj.DESCRIPTOR.fields_by_name[key].type == FieldDescriptor.TYPE_INT32):
                    t = [int(L) for L in l]
                    getattr(temp_obj,key)[:] = t
                elif(temp_obj.DESCRIPTOR.fields_by_name[key].type == FieldDescriptor.TYPE_FLOAT):
                    t = [float(L) for L in l]
                    getattr(temp_obj,key)[:] = t
            else:

                try:
                    setattr(temp_obj,key,val)
                except:
                    t = type(getattr(temp_obj,key))
                    
                    if(t == type(1)):
                        setattr(temp_obj,key,int(val))
                    elif(t==type(2.3)):
                        setattr(temp_obj,key,float(val))
                    elif(t==type(False)):
                        setattr(temp_obj,key,val=='true')
                        
                    else:
                        print("list_type")
                        print(temp_obj.DESCRIPTOR.fields_by_name[key].type == FieldDescriptor.TYPE_INT32)
                        
                            
       
        data = temp_obj.SerializeToString()
        #response = person_pb2.Person()
        print("serialized Payload")
        print(data)
        
    return JsonResponse({"Sucess":True})


