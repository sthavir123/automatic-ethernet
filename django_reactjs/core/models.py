from django.db import models
from django.core.files.storage import FileSystemStorage

# Create your models here.
# Modiy this class for custom handling of files with same name
# Currently Overwrites files with same name instead of default behaviour of random renaming the second file 
class OverwriteStorage(FileSystemStorage):
    
    def _save(self, name, content):
        self.delete(name)
        return super(OverwriteStorage, self)._save(name, content)

    def get_available_name(self, name, max_length=None):
        return name

# Class to Store File
class Files(models.Model):
    file = models.FileField(upload_to='',storage=OverwriteStorage())

    def __str__(self):
        return self.file
# for stroing document (name,file)
class Document(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    file = models.FileField()