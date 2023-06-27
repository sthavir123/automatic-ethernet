from django.urls import path, include,re_path
from rest_framework.routers import DefaultRouter
from .views import FilesViewSet,my_view,protopost,arxml_parse

router = DefaultRouter()
router.register('files', FilesViewSet, basename='files')
#router.register('proto', my_view, basename='proto')

urlpatterns = [
    path('api/', include(router.urls)),
    path('proto', my_view, name='proto'),
    path('proto/set',protopost,name='protopost'),
    re_path(r'arxml/parse/$',arxml_parse,name='arxml_parse')
]
