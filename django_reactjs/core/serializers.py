from rest_framework import serializers
from .models import Files

#serialize files
class FilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Files
        fields = ['id','file']
        