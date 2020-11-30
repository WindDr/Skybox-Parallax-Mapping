#version 330 core
out vec4 FragColor;

in  vec3 FragPos;
in  vec2 TexCoords;
in  vec3 TangentLightPos;
in  vec3 TangentViewPos;
in  vec3 TangentFragPos;

uniform sampler2D diffuseMap;  
uniform sampler2D normalMap;
uniform sampler2D depthMap;

uniform float heightScale;

//���ؾ�λ�Ƶ���������
vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir)
{ 
	/*****
	float height =  texture(depthMap, texCoords).r;    //texCoords�Ӹ߶���ͼ������������ǰfragment�߶�H(A)
    vec2 p = viewDir.xy / viewDir.z * (height * height_scale);//viewDir������������zԪ�أ���fragment�ĸ߶ȶ�����������
    return texCoords - p;					//height_scale���ж���Ŀ��ƣ���Ϊ�Ӳ�Ч�����û��һ�����Ų���ͨ�������ǿ��
	******/

    const float minLayers = 8;					//��Ȳ�Σ������Ӳ���ͼ����
    const float maxLayers = 32;
									//����viewDir����z����ĵ�ˣ�������������
    float numLayers = mix(maxLayers, minLayers, abs(dot(vec3(0.0, 0.0, 1.0), viewDir)));  
    
    float layerDepth = 1.0 / numLayers;				// ����ÿһ��Ĳ��С������
    
    float currentLayerDepth = 0.0;					// ��ǰ�����
    // the amount to shift the texture coordinates per layer (from vector P)
    vec2 P = viewDir.xy / viewDir.z * heightScale;		//����p���������ƶ�
    vec2 deltaTexCoords = P / numLayers;
  
    vec2  currentTexCoords     = texCoords;				//��ʼ��ֵ
    float currentDepthMapValue = texture(depthMap, currentTexCoords).r;	//������ȵ���������

    while(currentLayerDepth < currentDepthMapValue)
    {
       
        currentTexCoords -= deltaTexCoords;			// ����p�������������������
      
        currentDepthMapValue = texture(depthMap, currentTexCoords).r;    // ���ݵ�ǰ���������ȡ���ֵ
       
        currentLayerDepth += layerDepth;   // �õ���һ�����
    }
	//********�Ӳ��ڱ�ӳ�䣬���Բ�ֵ
    // ��ȡ����ǰ����������
    vec2 prevTexCoords = currentTexCoords + deltaTexCoords;

    // ��ȡ����ǰ������
    float afterDepth  = currentDepthMapValue - currentLayerDepth;
    float beforeDepth = texture(depthMap, prevTexCoords).r - currentLayerDepth + layerDepth;
 
    // ���Բ�ֵ
    float weight = afterDepth / (afterDepth - beforeDepth);	//����Ȩ��
    vec2 finalTexCoords = prevTexCoords * weight + currentTexCoords * (1.0 - weight);

    return finalTexCoords;
}

void main()
{           
    vec3 viewDir = normalize(TangentViewPos - TangentFragPos);//���߿ռ����
    vec2 texCoords = TexCoords;
		 //****�������곬����0��1�ķ�Χ���в�������������Ļ��Ʒ�ʽ�����˲���ʵ�Ľ����
    texCoords = ParallaxMapping(TexCoords,  viewDir);       
    if(texCoords.x > 1.0 || texCoords.y > 1.0 || texCoords.x < 0.0 || texCoords.y < 0.0)
        discard;			//�������귶Χ�ľͶ�����

    vec3 normal = texture(normalMap, texCoords).rgb;	//��normͼ��ȡ���߷���
    normal = normalize(normal * 2.0 - 1.0);				//��׼��
   
    
    vec3 color = texture(diffuseMap, texCoords).rgb;		// ��ȡdiffuse color
    
    vec3 ambient = 0.1 * color;								// ����
   
    vec3 lightDir = normalize(TangentLightPos - TangentFragPos);
    float diff = max(dot(lightDir, normal), 0.0);			//diffuseӰ�죬ȡ����0��ֵ
    vec3 diffuse = diff * color;							// diffuse����
   
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 halfwayDir = normalize(lightDir + viewDir);       //Blinn-Phong ��� (light view)��viewPos �� �����������90��������
    float spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);  //Ӱ��
    vec3 specular = vec3(0.2) * spec;				// specular   ����

	vec3 result = (ambient + diffuse + specular);
    FragColor = vec4(result, 1.0);
}