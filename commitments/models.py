from django.conf import settings
from django.db import models


class Commitment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             related_name='commitments')
    title = models.CharField(max_length=300)
    suggestion = models.TextField()
    likes = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '{}'.format(self.title)
